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

        const tiles = map.addTilesetImage('room', 'mainRoom');
        const vat = map.addTilesetImage('vat small', 'vat');
        const floor = map.createStaticLayer('Floor Layer', tiles, 0,0);
        const walls = map.createStaticLayer('Wall Layer', tiles, 0,0);
        walls.setCollisionByExclusion([-1]);

        const vatLevel0 = map.createDynamicLayer('Vat Level 0', vat, 0, 0);
        const vatLevel1 = map.createDynamicLayer('Vat Level 1', vat, 0, 0);
        vatLevel1.visible = false;
        const vatLevel2 = map.createDynamicLayer('Vat Level 2', vat, 0, 0);
        vatLevel2.visible = false;

        this.sys.animatedTiles.init(map);
        this.sys.animatedTiles.setRate(0.5);

        this.anims.create({
            key:'blop',
            frames:this.anims.generateFrameNumbers('player', {start:2, end:3}),
            frameRate: 16,
            repeat: -1
        });

        this.plots = map.createFromObjects('Plots', 929, {key: 'plots', frame: 3});
        this.physics.world.enable(this.plots);
        this.plots.forEach((plot, index) => {
            SystemState.addPlot();
            plot.plotIndex = index;
        });

        // this.this.physics.add.group({
            
        // })

        this.interactTests = [
            ...this.plots,
        ];

        this.target = null;

        this.player = this.physics.add.sprite(400,300, 'player', 0);
        this.player.setDepth(100);

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels=true;

        this.physics.add.collider(this.player, walls);
        this.physics.add.overlap(this.player, this.interactTests);

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
        this.animatedTiles.updateAnimatedTiles();

        this.handleMovementInput();
        this.handleUIInput();
        this.handleInteractionInput();
        this.detectOverlap();
        this.chaos.checkForMessage(time);
        this.checkGrowthSprite();
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
                    this.interactWithPlot(this.nearest);
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
            
            if (!this.target) {
                this.target = this.add.rectangle(this.nearest.x, this.nearest.y, this.nearest.width, this.nearest.height);
                this.target.isFilled = false;
                this.target.setStrokeStyle(4, 0x6495ed);
                this.target.setDepth(99);
            }

            // TODO: Make instruction much more complex
            SystemState.currentInstruction = 'plant a seed';
        } else {
            this.nearest = null;
            if (this.target) {
                this.target.visible = false;
                this.target.destroy();
                this.target = null;
            }
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
            SystemState.fountain[0].planted = true;
        }
    }

    interactWithPlot(plot) {
        var idx = plot.plotIndex;
        if(!SystemState.farm[idx].planted) {
            if (SystemState.inventory.food < 1) {
                SystemState.displayMessage("You don't have a seed, dipshit")
            } else {
                SystemState.farm[this.nearest.plotIndex].planted = true;
                SystemState.farm[this.nearest.plotIndex].growing = true;
                SystemState.inventory.food--;
                plot.setFrame(13);
            }
        } else if(SystemState.farm[idx].harvestable) {
            var farmYield = globalConfig.farmLevels[SystemState.farm[idx].farmLevel].produce;
            SystemState.inventory.food += farmYield;
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
}

export default MainScene;