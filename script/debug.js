/** @type {import("../typings/phaser")} */

import {screenHeight, screenWidth} from './global-config.js';
import SystemState from './state-machine.js';

class DebugScene extends Phaser.Scene {
    init() {
        console.log("Debug Init");
    }

    create() {
        console.log("Debug Create");
        this.add.text(0, 0, 'Debug');

        var SLIMECOUNT = 12;
        var TRAITORCOUNT = 5;

        for (var i=0; i<SLIMECOUNT; i++) {
            allSlimes.push(new Slime(i,0,false));
        }

        for (var i=SLIMECOUNT; i<SLIMECOUNT+TRAITORCOUNT; i++) {
            allSlimes.push(new Slime(i,0,true));
        }

        for (var i=0; i<allSlimes.length; i++) {
            allSlimes[i].setSpriteAndColor(this,'mass');
        }
        
        //create eye animations
        for (var i=0;i < eyeKeys.length;i++) {
            var startIdx = 2 + 6*i;
            var endIdx = startIdx + 1;

            this.anims.create({
                key: eyeKeys[i],
                frames: this.anims.generateFrameNumbers('mass', {start: startIdx, end: endIdx}),
                frameRate: 5,
                repeat: -1
            })
        }

        //create mouth animations
        for (var i=0;i < mouthKeys.length;i++) {
            var startIdx = 4 + 6*i;
            var endIdx = startIdx + 1;

            this.anims.create({
                key: mouthKeys[i],
                frames: this.anims.generateFrameNumbers('mass', {start: startIdx, end: endIdx}),
                frameRate: 5,
                repeat: -1
            })
        }

        //create hair animations
        for (var i=0;i < hairKeys.length;i++) {
            var startIdx = 6 + 6*i;
            var endIdx = startIdx + 1;

            this.anims.create({
                key: hairKeys[i],
                frames: this.anims.generateFrameNumbers('mass', {start: startIdx, end: endIdx}),
                frameRate: 5,
                repeat: -1
            })
        }

        //create body animation
        this.anims.create({
            key: 'bounce',
            frames: this.anims.generateFrameNumbers('mass', {start: 0, end: 1}),
            frameRate: 5,
            repeat: -1
        })

    }
    update () {
        for (var i=0; i<allSlimes.length; i++) {
            allSlimes[i].animate();
        }
    }
}

var allSlimes = [];
var rnd = Phaser.Math.RND;

var colors = [0xffffff,0xc0c0c0,0x808080,0x000000,0xff0000,0x800000,0xffff00,0x808000,0x00ff00,0x008000,0x00ffff,0x008080,0x0000ff,0x000080,0xff00ff,0x800080];
var eyeKeys = ['eye0','eye1','eye2','eye3','eye4','eye5','eye6'];
var mouthKeys = ['mouth0','mouth1','mouth2','mouth3','mouth4','mouth5','mouth6'];
var hairKeys = ['hair0','hair1','hair2','hair3','hair4','hair5'];


class Slime {
    constructor(ID,RoomID,traitor) {
        var rnd = Phaser.Math.RND;
        this.ID = ID;
        this.RoomID = RoomID;
        this.xPos = Math.random()*280+10;
        this.yPos = Math.random()*180+10;
        this.eyesKey = rnd.pick(eyeKeys);
        this.mouthKey = rnd.pick(mouthKeys);
        this.hairKey = rnd.pick(hairKeys);
        this.tint = rnd.pick(colors);
        this.tintHair = rnd.pick(colors);
        this.traitor = traitor;
        this.bod;
        this.eyes;
        this.mouth;
        this.hair;
    }

    setBody(scene,key) {
        this.bod = scene.add.sprite(this.xPos,this.yPos,key);
    }

    setEyes(scene,key) {
        this.eyes = scene.add.sprite(this.xPos,this.yPos,key);
    }

    setMouth(scene,key) {
        this.mouth = scene.add.sprite(this.xPos,this.yPos,key);
    }

    setHair(scene,key) {
        this.hair = scene.add.sprite(this.xPos,this.yPos,key);
    }

    setColor() {
        this.bod.setTint(this.tint);
    }

    setColorEyes() {
        this.eyes.setTint(this.tint);
    }

    setColorHair() {
        this.hair.setTint(this.tintHair);
    }

    setSprite(scene,key) {
        this.setBody(scene,key);
        this.setEyes(scene,key);
        this.setMouth(scene,key);
        this.setHair(scene,key);
    }

    setSpriteAndColor(scene,key) {
        this.setSprite(scene,key);
        this.setColor();
        this.setColorEyes();
        this.setColorHair();
    }

    animate() {
        this.bod.play('bounce',true);
        this.eyes.play(this.eyesKey,true);
        this.mouth.play(this.mouthKey,true);
        this.hair.play(this.hairKey,true);
    }
}

export default DebugScene;