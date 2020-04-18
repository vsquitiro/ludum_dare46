/** @type {import("../typings/phaser")} */

import {screenHeight, screenWidth} from './global-config.js';

class Loader extends Phaser.Scene {
    key = 'loader';
    constructor(config) {
        config = config || {};
        config.pack = {
            files: [
                {
                    type: 'image',
                    key: 'loading',
                    url: 'assets/loading.png',
                }
            ]
        };

        super(config);
    }
    init() {
        console.log("Loader Init");
        var image = this.add.image(0, 0, 'loading');
        image.setOrigin(0.5, 0.5);
        image.setPosition(screenWidth / 2, screenHeight / 2);
    }

    preload() {
        console.log("Loader Preload");
        // Add all assets to be loaded here.
        this.load.tilemapTiledJSON('map', 'assets/testMap.json');
        this.load.image('tiles', 'assets/whiteTiles.png');
        this.load.spritesheet('sprites', 'assets/placeholdersprite.png', {frameWidth: 32, frameHeight: 32});
        this.load.image('slimeBlock', 'assets/Characterslimes.png');
        this.load.spritesheet('player', 'assets/Characterslimes.png', {frameWidth: 32, frameHeight: 32});
        this.load.image('textBox', 'assets/text-box.png');

        //Sounds
        this.load.audio('error1', 'assets/Error1.mp3');
    }

    create() {
        console.log("Loader Create");

        // Create Animations
        // this.anims.create({
        //     key: 'staticSlime1',
        //     frames: this.anims.generateFrameNumbers('cameraTiles', {start: 9, end: 10}),
        //     frameRate: 5,
        //     retpeat: -1
        // });

        // Transition to start scene
        this.scene.start('menu');
        this.scene.switch('loader', 'menu');
    }
}

export default Loader;