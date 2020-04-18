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

        this.anims.play('blop', testObj);
//        testObj.callAll('animations.add','animations','blop',[2,3],10,true);
 //       testObj.callAll('animations.play','animations','spin');

        this.player = this.physics.add.sprite(50,100, 'player', 0);

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels=true;

        this.physics.add.collider(this.player, obstacles);
    }
    update(time, delta) {
        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-160);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(160);
        }

        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-160);
        }
        else if(this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(160);
        }
    }
}

export default MainScene;