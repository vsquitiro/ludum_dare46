/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';

class MainScene extends Phaser.Scene {
    init() {
        console.log("Main Scene Init");
    }
    create() {
        // What to create?
        var map = this.make.tilemap({key: 'map'});

        var tiles = map.addTilesetImage('White Tiles', 'tiles');
        var sprites = map.addTilesetImage('placeholder', 'sprites');
        var slimeBlock = map.addTilesetImage('Player', 'slimeBlock');
        var floor = map.createStaticLayer('Floor Layer', tiles, 0,0);
        var walls = map.createStaticLayer('Wall Layer', tiles, 0,0);
        walls.setCollisionByExclusion([-1]);

        this.anims.create({
            key:'blop',
            frames:this.anims.generateFrameNumbers('player', {start:2, end:3}),
            frameRate: 16,
            repeat: -1
        });

        this.plots = map.createFromObjects('Plots', 63, {key: 'sprites', frame: 2});
        this.physics.world.enable(this.plots);

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
        this.physics.add.overlap(this.player, this.plots);

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
    }

    handleMovementInput() {
        const { playerVelocity } = globalConfig;
        const gamepad = this.input.gamepad.getPad(0);

        this.player.body.setVelocity(0);

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
            if (Math.abs(stickPos.x) > .1) {
                this.player.body.setVelocityX(stickPos.x * playerVelocity);
            }
            if (Math.abs(stickPos.y) > .1) {
                this.player.body.setVelocityY(stickPos.y * playerVelocity);
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
        const gamepad = this.input.gamepad.getPad(0);
        const curPadState = {
            accept: gamepad && gamepad.buttons[0].value === 1,
        };
        const curKeyState = {
            accept: this.interaction.accept.isDown
        };

        if ((!this.previousKeyState.accept && curKeyState.accept) || (!this.previousPadState.accept && curPadState.accept)) {
            console.log("ACCEPT!");
            if (this.nearest) {
                
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

    detectOverlap() {
        if (!this.player.body.touching.none || this.player.body.embedded) {
            this.nearest = this.physics.closest(this.player, this.plots);
            this.target.visible = true;
            this.target.setPosition(this.nearest.x, this.nearest.y);
        } else {
            this.nearest = null;
            this.target.visible = false;
        }
    }
}

export default MainScene;