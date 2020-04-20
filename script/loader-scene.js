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
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        this.load.scenePlugin({
            key: 'AnimatedTiles',
            url: 'lib/AnimatedTiles.js',
            sceneKey: 'animatedTiles'
        });
        this.load.tilemapTiledJSON('map', 'assets/main.json');
        this.load.spritesheet('mainRoom', 'assets/map800.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('plots', 'assets/map800.png', {frameWidth: 192, frameHeight: 192, margin: 64});
        //remove when real sprites are added
        this.load.spritesheet('placeholder','assets/placeholdersprite.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('springs','assets/fountain.png', {frameWidth: 192, frameHeight: 192});
        this.load.spritesheet('objects','assets/objects.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('basin', 'assets/basin.png', {frameWidth: 192, frameHeight: 192});
        this.load.spritesheet('vat', 'assets/trex.png', {frameWidth: 128, frameHeight: 224, spacing: 32});
        this.load.spritesheet('player', 'assets/astronoot.png', {frameWidth: 64, frameHeight: 128});
        this.load.image('textBox', 'assets/text-box.png');
        this.load.image('invBG', 'assets/Inv BG.png');

        //Sounds
        this.load.audio('mainLoop', 'assets/ALIENFARM.mp3');
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
        this.scene.start('audio');
        this.scene.switch('loader', 'menu');
    }
}

export default Loader;