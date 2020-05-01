import Phaser from 'phaser';
import {screenHeight, screenWidth} from '../helpers/global-config';

// @ts-ignore
import mapImg from '../../assets/map800.png';
// @ts-ignore
import fountainImg from '../../assets/fountain.png';
// @ts-ignore
import objectsImg from '../../assets/objects.png';
// @ts-ignore
import basinImg from '../../assets/basin.png';
// @ts-ignore
import trexImg from '../../assets/trex.png';
// @ts-ignore
import astronootImg from '../../assets/astronoot.png';
// @ts-ignore
import rexgodImg from '../../assets/rexgod.png';
// @ts-ignore
import messageImg from '../../assets/message.png';
// @ts-ignore
import invBgImg from '../../assets/Inv BG.png';

// @ts-ignore
import animatedTiles from 'file-loader!../../lib/AnimatedTiles.js';
// @ts-ignore
import mainTilemap from '../../assets/main.json';

// @ts-ignore
import mainLoop from '../../assets/ALIENFARM.mp3';
// @ts-ignore
import blip from '../../assets/Blipspeech.wav';
// @ts-ignore
import crack from '../../assets/crack.wav';

class Loader extends Phaser.Scene {
    static key = 'loader';
    init() {
        console.log("Loader Init");
        const text = this.add.text(screenWidth/2, screenHeight/2, 'Loading...');
        text.setFontFamily('Helvetica, Verdana, Sans');
        text.setFontSize(100);
        text.setOrigin(0.5, 0.5);
    }

    preload() {
        console.log("Loader Preload");
        // Add all assets to be loaded here.
        this.load.scenePlugin({
            key: 'AnimatedTiles',
            url: animatedTiles,
            sceneKey: 'animatedTiles'
        });
        // @ts-ignore
        this.load.tilemapTiledJSON('map', mainTilemap);
        this.load.spritesheet('mainRoom', mapImg, {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('plots', mapImg, {frameWidth: 192, frameHeight: 192, margin: 64});
        //remove when real sprites are added
        // this.load.spritesheet('placeholder','assets/placeholdersprite.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('springs',fountainImg, {frameWidth: 192, frameHeight: 192});
        this.load.spritesheet('objects', objectsImg, {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('basin', basinImg, {frameWidth: 192, frameHeight: 192});
        this.load.spritesheet('vat', trexImg, {frameWidth: 128, frameHeight: 224, spacing: 32});
        this.load.spritesheet('player', astronootImg, {frameWidth: 64, frameHeight: 128});
        this.load.spritesheet('dinoFace', rexgodImg, {frameWidth: 192, frameHeight: 192});
        this.load.image('textBox', messageImg);
        this.load.image('invBG', invBgImg);

        //Sounds
        this.load.audio('mainLoop', mainLoop);
        this.load.audio('speechBeep', blip);
        this.load.audio('crack', crack);
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
        this.scene.switch('loader');
    }
}

export default Loader;