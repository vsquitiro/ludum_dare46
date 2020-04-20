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
        this.spriteIdx = [0,3,12,15,24];

        // What to create?
        const map = this.make.tilemap({key: 'map'});

        const tiles = map.addTilesetImage('room', 'mainRoom');
        const vat = map.addTilesetImage('vat small', 'vat');
        const floor = map.createStaticLayer('Floor Layer', tiles, 0,0);
        const walls = map.createStaticLayer('Wall Layer', tiles, 0,0);
        walls.setCollisionByExclusion([-1]);

        this.vatLevel0 = map.createDynamicLayer('Vat Level 0', vat, 0, 0);
        this.vatLevel1 = map.createDynamicLayer('Vat Level 1', vat, 0, 0);
        this.vatLevel1.visible = false;
        this.vatLevel2 = map.createDynamicLayer('Vat Level 2', vat, 0, 0);
        this.vatLevel2.visible = false;
        this.sys.animatedTiles.init(map);
        this.sys.animatedTiles.setRate(0.5);

        // this.anims.create({
        //     key:'blop',
        //     frames:this.anims.generateFrameNumbers('player', {start:2, end:3}),
        //     frameRate: 16,
        //     repeat: -1
        // });

        this.interactables = [];

        const transformObject = (obj) => {
            const updatedObj = { ...obj };
            updatedObj.customProperties = obj.properties.reduce((acc, prop) => {
                acc[prop.name] = prop.value;
                return acc;
            }, {});
            updatedObj.customProperties = {
                ...updatedObj.customProperties,
                gid: updatedObj.gid,
                id: updatedObj.id,
            };
            updatedObj.get = (name) => updatedObj.customProperties[name];
            return updatedObj;
        };
        const createZone = (interactor) => {
            const x = interactor.x + (interactor.width / 2);
            const y = interactor.y + (interactor.height / 2);
            const zone = this.add.zone(x, y, interactor.width, interactor.height);
            zone.customProperties = {
                ...interactor.customProperties
            };
            zone.get = (name) => zone.customProperties[name];
            zone.set = (name, value) => zone.customProperties[name] = value;
            zone.getTarget = () => this.interactables.find((sprite) => {
                return sprite.get('id') == zone.get('forObject');
            });
            this.physics.world.enable(zone);
            zone.body.moves = false;
            return zone;
        };
        const createSprite = (sheet, frame, animation) => (obj) => {
            const x = obj.x + (obj.width / 2);
            const y = obj.y - (obj.height / 2);
            const sprite = this.physics.add.sprite(x, y, sheet, frame);
            sprite.customProperties = {
                ...obj.customProperties
            };
            sprite.get = (name) => sprite.customProperties[name];
            sprite.set = (name, value) => sprite.customProperties[name] = value;

            sprite.setImmovable(true);
            return sprite;
        };

        const plotLayer = map.getObjectLayer('Plots');
        const plotObjects = plotLayer.objects.map(transformObject);
        this.plots = plotObjects
            .filter((obj) => obj.get('objectType') == 'plot')
            .map(createSprite('basin', 0))
            .map((plot, index) => {
                plot.set('plotIndex', index);
                SystemState.addPlot(plot.get('id'));
                plot.getPlotDef = () => SystemState.farm[index];
                return plot;
            });
        this.plotInteractions = plotObjects
            .filter((obj) => obj.get('objectType') == 'interactor')
            .map(createZone);

        const springLayer = map.getObjectLayer('Springs');
        const springObjects = springLayer.objects.map(transformObject);
        this.springs = springObjects
            .filter((obj) => obj.get('objectType') == 'spring')
            .map(createSprite('springs', 0, 'lvl00'))
            .map((spring, index) => {
                spring.set('springIndex', index);
                SystemState.addSpring(spring.get('id'));
                spring.getSpringDef = () => SystemState.fountain[index];
                return spring;
            });
        this.springInteractions = springObjects
            .filter((obj) => obj.get('objectType') == 'interactor')
            .map(createZone);

        const godControlLayer = map.getObjectLayer('GodControls');
        const godControlObjects = godControlLayer.objects.map(transformObject);
        this.foodTerminal = godControlObjects
            .filter((obj) => obj.get('objectType') == 'foodTerminal')
            .map(createSprite('objects', 0));
        this.fuelTerminal = godControlObjects
            .filter((obj) => obj.get('objectType') == 'fuelTerminal')
            .map(createSprite('objects', 1));
        this.godControlInteractions = godControlObjects
            .filter((obj) => obj.get('objectType') == 'interactor')
            .map(createZone);


        const fertLayer = map.getObjectLayer('Fert');
        const fertObjects = fertLayer.objects.map(transformObject);
        this.ferts = fertObjects
            .filter((obj) => obj.get('objectType') == 'fert')
            .map(createSprite('objects', 2));        
        this.fertInteractions = fertObjects
            .filter((obj) => obj.get('objectType') == 'interactor')
            .map(createZone);

        this.interactables = [
            ...this.plots,
            ...this.springs,
            ...this.fuelTerminal,
            ...this.foodTerminal,
            ...this.ferts,
        ];
        this.targetZones = [
            ...this.plotInteractions,
            ...this.springInteractions,
            ...this.godControlInteractions,
            ...this.fertInteractions,
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
        this.physics.add.collider(this.player, this.interactables);
        this.physics.add.overlap(this.player, this.targetZones);

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

        // this.debugKey = this.input.keyboard.addKeys(
        //     {feed:Phaser.Input.Keyboard.KeyCodes.F,
        //     plant:Phaser.Input.Keyboard.KeyCodes.P}
        //     );

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
        this.checkFillSprite();
        this.checkGodLevel();
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
                    const type = this.nearest.get && this.nearest.get('objectType');
                    switch (type) {
                    case 'plot':
                        this.interactWithPlot(this.nearest); break;
                    case 'spring':
                        this.interactWithSpring(this.nearest); break;
                    case 'foodTerminal':
                        this.interactWithFoodTerminal(); break;
                    case 'fuelTerminal':
                        this.interactWithFuelTerminal(); break;
                    case 'fert':
                        this.interactWithFert(); break;
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
            const overlaps = [];
            this.physics.overlap(this.player, this.targetZones, (player, interactor) => overlaps.push(interactor));
            if (!overlaps.length) return;

            const mainOverlap = this.physics.closest(this.player, overlaps);

            const nearest = mainOverlap.getTarget ? mainOverlap.getTarget() : mainOverlap;

            if (nearest != this.nearest) {
                this.nearest = nearest;
                if (this.target) {
                    this.target.destroy();
                    this.target = null;
                }
            }
            if (!this.target) {
                this.target = this.add.rectangle(this.nearest.x, this.nearest.y, this.nearest.width, this.nearest.height);
                this.target.isFilled = false;
                this.target.setStrokeStyle(4, 0x6495ed);
                this.target.setDepth(99);
            }

            this.displayInteractAction(this.nearest);
        } else {
            this.nearest = null;
            if (this.target) {
                this.target.destroy();
                this.target = null;
            }
            SystemState.currentInstruction = null;
        }

        //TODO remove when done debugging
        // if (this.debugKey.feed.isDown)
        // {
        //     SystemState.god.hunger = Math.max(0, SystemState.god.hunger - 1);
        //     SystemState.god.exp += .5;
        // }
        // if (this.debugKey.plant.isDown)
        // {
        //     SystemState.farm[0].planted = true;
        // }
    }

    displayInteractAction(focus) {
        const type = focus.get && focus.get('objectType');
        if (type === 'plot') {
            var idx = focus.get('plotIndex');
            if(!SystemState.farm[idx].planted) {
                SystemState.currentInstruction = 'plant a piece of food';
            } else if (SystemState.farm[idx].harvestable) {
                SystemState.currentInstruction = 'harvest food';
            } else if (!SystemState.farm[idx].fert) {
                SystemState.currentInstruction = 'use fertilizer';
            }
        } else if(type === 'spring') {
            var idx = focus.get('springIndex');
            if(!SystemState.fountain[idx].planted) {
                SystemState.currentInstruction = 'plant a unit of fuel';
            } else if (SystemState.fountain[idx].currentUnits > 0) {
                SystemState.currentInstruction = 'harvest fuel';
            } else {
                if(SystemState.fountain[idx].rateLevel !=4) {
                    SystemState.currentInstruction = 'upgrade spring with fuel';
                }
            }
        } else if(type === 'foodTerminal') {
            SystemState.currentInstruction = 'feed god';
        } else if(type === 'fuelTerminal') {
            SystemState.currentInstruction = 'fill vat';
        } else if(type === 'fert') {
            SystemState.currentInstruction = 'spend 5 food and fuel each to make fertilizer';
        }
    }

    interactWithPlot(plot) {
        const farm = plot.getPlotDef();
        if(!farm.planted) {
            if (SystemState.inventory.food < 1) {
                SystemState.displayMessage("You don't have a seed, dipshit");
            } else if(SystemState.god.level != 0 || SystemState.god.teaching == true) {
                SystemState.god.teaching = false;
                farm.planted = true;
                farm.growing = true;
                SystemState.inventory.food--;
                plot.setFrame(1);
            } else {
                SystemState.displayMessage("Farm later, feed now!");        
            }
        } else if(farm.harvestable) {
            if(farm.fert) { 
                SystemState.inventory.food += farm.currentUnits*3;
            } else {
                SystemState.inventory.food += farm.currentUnits;
            }
            farm.currentUnits = 0;
            farm.planted = false;
            farm.harvestable = false;
            plot.setFrame(0);
        } else if(!farm.fert) {
            if(SystemState.inventory.fert > 0) {
                SystemState.inventory.fert--;
                farm.fert = true;
                farm.fertTimeRemain = 100;
            } else {
                SystemState.displayMessage("You need fertilizer to do that...");
            }
        }

        // } else if(SystemState.inventory.fuel > 0) {
            //Add back in if we reimplement farm levels
            //farm.farmExp++;
            //SystemState.inventory.fuel--;
        // }
    }

    checkGrowthSprite() {
        this.plots.forEach((plot) => {
            const farm = plot.getPlotDef();
            if(farm.harvestable) {
                plot.setFrame(2);
            }
            var fertLevel = farm.fertTimeRemain;
            if(fertLevel > 75) {
                plot.tint = 0xf1c40f;
            } else if(fertLevel > 50) {
                plot.tint = 0xf4d03f;
            } else if(fertLevel > 25) {
                plot.tint = 0xf7dc6f;
            } else if(fertLevel > 0) {
                plot.tint = 0xf9e79f;
            } else {
                plot.clearTint();
            }
        });
    }

    interactWithSpring(spring) {
        const fountain = spring.getSpringDef();
        var frameMod = this.spriteIdx[fountain.rateLevel];
        if(!fountain.planted) {
            if (SystemState.inventory.fuel < 1) {
                SystemState.displayMessage("Where's the fuel, moron?");
            } else {
                fountain.planted = true;
                SystemState.inventory.fuel--;
                spring.setFrame(1+frameMod);
            }
        } else if(fountain.currentUnits > 0) {
            SystemState.inventory.fuel += fountain.currentUnits;
            fountain.currentUnits = 0;
            spring.setFrame(1+frameMod);
        } else if(SystemState.inventory.fuel > 0) {
            SystemState.god.teaching = false;
            if(fountain.rateLevel != 4) {
                SystemState.inventory.fuel--;
                fountain.rateExp++;
            }
        }
    }

    checkFillSprite() {
        this.springs.forEach((spring, index)=> {
            const fountain = spring.getSpringDef();
            var frameMod = this.spriteIdx[fountain.rateLevel];
            var unitCount = fountain.currentUnits;
            //TODO change back when building is implimented
            var capacityLevel = fountain.rateLevel;
            // var capacityLevel = fountain.capacityLevel;
            var fuelCapacity = globalConfig.rateLevels[capacityLevel].capacity;
            // var fuelCapacity = globalConfig.capacityLevels[capacityLevel].capacity;
            if(unitCount == fuelCapacity) {
                spring.setFrame(6+frameMod);
            } else if (unitCount > 0) {
                spring.setFrame(2+frameMod);
            } else if (fountain.planted) {
                spring.setFrame(1+frameMod);
            } else {
                spring.setFrame(frameMod);
            }
        });
    }

    interactWithFoodTerminal() {
        if(SystemState.inventory.food < 1) {
            SystemState.displayMessage("Are YOU the food!?");
        } else {
            if(!SystemState.god.teaching || SystemState.god.level > 0) {
                SystemState.inventory.food--;
                SystemState.god.hunger -= 10;
                SystemState.god.exp++;
            } else {
                SystemState.displayMessage("You can't plant it if I eat it!");
            }
        }
    }

    interactWithFuelTerminal() {
        if(SystemState.inventory.fuel < 1) {
            SystemState.displayMessage("Aren't you forgetting something?");
        } else {
            if(!SystemState.god.teaching) {
                SystemState.inventory.fuel--;
                var currentUnits = SystemState.vat.currentUnits;
                var currentMax = globalConfig.vatLevels[SystemState.god.level].maxUnits;
                SystemState.vat.currentUnits = Math.min(currentUnits+20,currentMax);
            } else {
                SystemState.inventory.fuel--;
                SystemState.vat.currentUnits += 20;
                SystemState.displayMessage("No, put the fuel in the fountain!");
                SystemState.inventory.fuel++;
                SystemState.vat.currentUnits -= 20;
                SystemState.god.teaching = false;
            }
        } 
    }

    checkGodLevel() {
        if (SystemState.god.level == 2) {
            this.vatLevel0.visible = false;
            this.vatLevel1.visible = true;
        } else if (SystemState.god.level == 3) {
            this.vatLevel1.visible = false;
            this.vatLevel2.visible = true;
        }
    }

    interactWithFert() {
        if (SystemState.inventory.food >= 5 && SystemState.inventory.fuel >= 5) {
            SystemState.inventory.fert++;
            SystemState.inventory.food -= 5;
            SystemState.inventory.fuel -= 5;           
        } else {
            SystemState.displayMessage("You need materials and a brain...");
        }
    }

}

export default MainScene;