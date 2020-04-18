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
        var slimeBlock = map.addTilesetImage('Player', 'slimeBlock');
        var floor = map.createStaticLayer('Tile Layer 1', tiles, 0,0);
        var obstacles = map.createStaticLayer('Tile Layer 2', slimeBlock, 0,0);
        obstacles.setCollisionByExclusion([-1]);

        this.anims.create({
            key:'blop',
            frames:this.anims.generateFrameNumbers('player', {start:2, end:3}),
            frameRate: 16,
            repeat: -1
        });

        var testObj = map.createFromObjects('Object Layer 1',59,{key:'player'});
       // testObj.setCollisionByExclusion([-1]);

        this.anims.play('blop', testObj);

        this.player = this.physics.add.sprite(50,100, 'player', 0);

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors = this.input.keyboard.addKeys(
            {up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D}
            );

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels=true;

        this.physics.add.collider(this.player, obstacles);
    }
    update(time, delta) {
        const { playerVelocity } = globalConfig;
        const gamepad = this.input.gamepad.getPad(0);
        SystemState.simulation.updateSimulation(delta);

        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown || (gamepad && gamepad.left))
        {
            this.player.body.setVelocityX(-playerVelocity);
        }
        else if (this.cursors.right.isDown || (gamepad && gamepad.right))
        {
            this.player.body.setVelocityX(playerVelocity);
        }

        // Vertical movement
        if (this.cursors.up.isDown || (gamepad && gamepad.up))
        {
            this.player.body.setVelocityY(-playerVelocity);
        }
        else if(this.cursors.down.isDown || (gamepad && gamepad.down))
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
}

export default MainScene;