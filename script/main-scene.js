/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';

import { Chaos } from './chaos.js';

class MainScene extends Phaser.Scene {
    init() {
        console.log("Main Scene Init");
        this.chaos = new Chaos();
    }
    create() {
        // What to create?
        const map = this.make.tilemap({key: 'map'});

        const tiles = map.addTilesetImage('White Tiles', 'tiles');
        const sprites = map.addTilesetImage('placeholder', 'sprites');
        const slimeBlock = map.addTilesetImage('Player', 'slimeBlock');
        const floor = map.createStaticLayer('Floor Layer', tiles, 0,0);
        const walls = map.createStaticLayer('Wall Layer', tiles, 0,0);
        walls.setCollisionByExclusion([-1]);

        const vatLevel0 = map.createStaticLayer('Vat Level 0', sprites, 0, 0);
        vatLevel0.setCollisionByExclusion([-1]);

        // this.anims.create({
        //     key:'blop',
        //     frames:this.anims.generateFrameNumbers('player', {start:2, end:3}),
        //     frameRate: 16,
        //     repeat: -1
        // });

        this.plots = map.createFromObjects('Plots', 63, {key: 'sprites', frame: 2});
        this.physics.world.enable(this.plots);
        this.plots.forEach((plot, index) => {
            SystemState.addPlot();
            plot.plotIndex = index;
            plot.type = "plot";
        });

        this.springs = map.createFromObjects('Springs', 65, {key: 'sprites', frame: 4});
        this.physics.world.enable(this.springs);
        this.springs.forEach((spring, index) => {
            SystemState.addSpring();
            spring.springIndex = index;
            spring.type = "spring";
        })

        this.interactTests = [
            ...this.plots,
            ...this.springs,
        ];

        this.target = this.add.rectangle(0, 0, 32, 32);
        this.target.setStrokeStyle(4, 0xffffff);
        this.target.visible = false;
        this.target.isFilled = false;

        this.player = this.physics.add.sprite(50,100, 'player', 0);

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels=true;

        this.physics.add.collider(this.player, walls);
        this.physics.add.collider(this.player, vatLevel0);
        this.physics.add.overlap(this.player, this.plots);
        this.physics.add.overlap(this.player, this.springs);

        this.createInput();
    }
    createInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys(
            {up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D}
            );
        this.interaction = this.input.keyboard.addKeys({
            accept: Phaser.Input.Keyboard.KeyCodes.E,
        });
        this.ui = this.input.keyboard.addKeys({
            pause: Phaser.Input.Keyboard.KeyCodes.ESC,
        });

        this.debugKey = this.input.keyboard.addKeys(
            {feed:Phaser.Input.Keyboard.KeyCodes.F,
            plant:Phaser.Input.Keyboard.KeyCodes.P}
            );

        this.previousPadState = {
            pause: false,
            accept: false,
        };
        this.previousKeyState = {
            pause: false,
            accept: false,
        };
    }

    update(time, delta) {
        SystemState.simulation.updateSimulation(delta);

        this.handleMovementInput();
        this.handleUIInput();
        this.handleInteractionInput();
        this.detectOverlap();
        this.chaos.checkForMessage(time);
        this.checkGrowthSprite();
        this.checkFillSprite();
    }

    handleMovementInput() {
        this.player.body.setVelocity(0);

        if (SystemState.allowMovement) {
            const { playerVelocity } = globalConfig;
            const gamepad = this.input.gamepad.getPad(0);

            // Horizontal movement
            if (this.cursors.left.isDown || this.wasd.left.isDown || (gamepad && gamepad.left))
            {
                this.player.body.setVelocityX(-playerVelocity);
            }
            else if (this.cursors.right.isDown || this.wasd.right.isDown || (gamepad && gamepad.right))
            {
                this.player.body.setVelocityX(playerVelocity);
            }

            // Vertical movement
            if (this.cursors.up.isDown || this.wasd.up.isDown || (gamepad && gamepad.up))
            {
                this.player.body.setVelocityY(-playerVelocity);
            }
            else if(this.cursors.down.isDown || this.wasd.down.isDown || (gamepad && gamepad.down))
            {
                this.player.body.setVelocityY(playerVelocity);
            }

            if (gamepad) {
                const stickPos = gamepad.leftStick;
                if (Math.abs(stickPos.x) > .2) {
                    this.player.body.setVelocityX(stickPos.x * playerVelocity);
                }
                if (Math.abs(stickPos.y) > .2) {
                    this.player.body.setVelocityY(stickPos.y * playerVelocity);
                }
            }
        }
    }

    handleUIInput() {
        const gamepad = this.input.gamepad.getPad(0);
        const curPadState = {
            pause: gamepad && gamepad.buttons[9].value === 1,
        };
        const curKeyState = {
            pause: this.ui.pause.isDown
        };

        if ((!this.previousKeyState.pause && curKeyState.pause) || (!this.previousPadState.pause && curPadState.pause)) {
            if (SystemState.isPaused) {
                SystemState.unpause();
            } else {
                SystemState.pause();
            }
        }

        this.previousPadState = {
            ...this.previousPadState,
            ...curPadState,
        };
        this.previousKeyState = {
            ...this.previousKeyState,
            ...curKeyState,
        };
    }

    handleInteractionInput() {
        if (SystemState.allowInteraction) {
            const gamepad = this.input.gamepad.getPad(0);
            const curPadState = {
                accept: gamepad && gamepad.buttons[0].value === 1,
            };
            const curKeyState = {
                accept: this.interaction.accept.isDown
            };

            if ((!this.previousKeyState.accept && curKeyState.accept) || (!this.previousPadState.accept && curPadState.accept)) {
                if (SystemState.message.current) {
                    if (SystemState.message.playing) {
                        SystemState.skipMessage();
                    } else {
                        SystemState.dismissMessage();
                    }
                }
                else if (this.nearest) {
                    if(this.nearest.type == "plot") {
                        this.interactWithPlot(this.nearest);
                    } else if(this.nearest.type == "spring") {
                        this.interactWithSpring(this.nearest);
                    }
                }
            }

            this.previousPadState = {
                ...this.previousPadState,
                ...curPadState,
            };
            this.previousKeyState = {
                ...this.previousKeyState,
                ...curKeyState,
            };
        } else {
            this.previousPadState = {
                ...this.previousPadState,
                accept: false,
            };
            this.previousKeyState = {
                ...this.previousKeyState,
                accept: false,
            };
        }
    }

    detectOverlap() {
        if (!this.player.body.touching.none || this.player.body.embedded) {
            this.nearest = this.physics.closest(this.player, this.interactTests);
            
            this.target.visible = true;
            this.target.setPosition(this.nearest.x, this.nearest.y);
            this.target.setSize(this.nearest.width, this.nearest.height);

            // TODO: Make instruction much more complex
            SystemState.currentInstruction = 'plant a seed';
        } else {
            this.nearest = null;
            this.target.visible = false;
            SystemState.currentInstruction = null;
        }

        if (this.debugKey.feed.isDown)
        {
            SystemState.god.hunger = Math.max(0, SystemState.god.hunger - 1);
            SystemState.god.exp += .5;
        }
        if (this.debugKey.plant.isDown)
        {
            SystemState.farm[0].planted = true;
        }
    }

    interactWithPlot(plot) {
        var idx = plot.plotIndex;
        if(!SystemState.farm[idx].planted) {
            if (SystemState.inventory.food < 1) {
                SystemState.displayMessage("You don't have a seed, dipshit");
            } else {
                SystemState.farm[idx].planted = true;
                SystemState.farm[idx].growing = true;
                SystemState.inventory.food--;
                plot.setFrame(13);
            }
        } else if(SystemState.farm[idx].harvestable) {
            SystemState.inventory.food += SystemState.farm[idx].currentUnits;
            SystemState.farm[idx].currentUnits = 0;
            SystemState.farm[idx].planted = false;
            SystemState.farm[idx].harvestable = false;
            plot.setFrame(2);

        }
    }

    checkGrowthSprite() {
        this.plots.forEach((plot, index) => {
            if(SystemState.farm[plot.plotIndex].harvestable) {
                plot.setFrame(9);
            }
        });        
    }

    interactWithSpring(spring) {
        var idx = spring.springIndex;
        if(!SystemState.fountain[idx].planted) {
            if (SystemState.inventory.fuel < 1) {
                SystemState.displayMessage("Are you out of brains, as well as fuel?");
            } else {
                SystemState.fountain[idx].planted = true;
                SystemState.inventory.fuel--;
                spring.setFrame(1);
            }
        } else if(SystemState.fountain[idx].currentUnits > 0) {
            SystemState.inventory.fuel += SystemState.fountain[idx].currentUnits;
            SystemState.fountain[idx].currentUnits = 0;
            spring.setFrame(1);
        } else if(SystemState.inventory.fuel > 1) {
            SystemState.inventory.fuel--;
            SystemState.fountain[idx].rateExp++;
        }
    }

    checkFillSprite() {
        this.springs.forEach((spring, index)=> {
            var unitCount = SystemState.fountain[spring.springIndex].currentUnits;
            var capacityLevel = SystemState.fountain[spring.springIndex].capacityLevel;
            var fuelCapacity = globalConfig.capacityLevels[capacityLevel].capacity;
            if(unitCount > 0) {
                if(unitCount == fuelCapacity) {
                    spring.setFrame(5);
                } else {
                    spring.setFrame(0);
                }
            }
        })
    }
}

export default MainScene;