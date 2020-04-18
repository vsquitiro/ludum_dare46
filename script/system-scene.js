/** @type {import("../typings/phaser")} */

import {screenHeight, screenWidth} from './global-config.js';
import SystemState from './state-machine.js';
import {c2px, c2py} from './inner-screen-positions.js';
import TabStrip from './tab-strip.js';

class Blop {
    constructor(xPos,yPos,scene,UR) {
        this.UR = UR;
        this.xPos = xPos;
        this.yPos = yPos;
        this.scene = scene;
        this.sprites = [];
        for (var i=0; i<4; i++) {
            if (i<2) {
                var x = xPos + i*32;
                var y = yPos;
            } else {
                var x = xPos + (i-2)*32;
                var y = yPos+32;
            }

            this.sprites.push(scene.add.sprite(x,y,'sysTile'));
            this.sprites[i].setInteractive().on('pointerdown', () => this.confirmRepair())
        }

        var speechLength = 20-(Math.floor(xPos/32));
        this.speechBubble = new SpeechBubble(xPos+51,yPos,scene,this,speechLength,UR);
    }

    updatePower(percent) {
        if (percent > 0) {
            this.speechBubble.setRepairMessage(percent);
        } else {
            this.speechBubble.setRepairConfirm();
        }
    }

    confirmRepair() {
        console.log('Blop was clicked');
        if (this.UR.currentSpendable==0) {
            console.log('Blop is ready to repair');
            this.UR.commitRepairs();
        }
    }

    animate() {
        this.sprites[0].play('helperTL',true);
        this.sprites[1].play('helperTR',true);
        this.sprites[2].play('helperBL',true);
        this.sprites[3].play('helperBR',true);
        this.speechBubble.animate();
    }
}

class SpeechBubble {
    constructor(xPos,yPos,scene,helper,mxLength,UR) {
        this.UR = UR;
        this.xPos = xPos;
        this.yPos = yPos;
        this.mxLength = mxLength;
        this.scene = scene;
        this.helper = helper;
        this.topSprites = [];
        this.bottomSprites = [];
        this.messageT = "null";
        this.messageB = "null";
        for (var i=0;i<mxLength;i++) {
            var x = xPos + 32*i;
            var yBot = yPos + 32;
            this.topSprites.push(scene.add.sprite(x,yPos,'border').setScale(1));
            this.bottomSprites.push(scene.add.sprite(x,yBot,'border').setScale(1));
        }
        this.talkingT = this.scene.add.text(this.xPos+16,this.yPos-3,this.messageT, {color:'black'});
        this.talkingB = this.scene.add.text(this.xPos+16,this.yPos+18,this.messageB, {color:'black'});
    }

    setMessage(messageT,messageB) {
        this.messageT = messageT;
        this.messageB = messageB;
    }

    setRepairMessage(percent) {
        this.messageT = "We can restore ";
        this.messageT += percent;
        this.messageT += " % more of the system!";
        this.messageB = "What functions would you like to restore?"
    }

    setRepairConfirm() {
        this.messageT = "Give me a click to blop these"
        this.messageB = "changes into the system!";
    }

    animate() {
        var chunks = this.mxLength;
        for (var i=0;i<(chunks-1);i++) {
            var currentTop = this.topSprites[i];
            var currentBot = this.bottomSprites[i];
            if (this.messageT==null) {
                currentTop.play('sTop3',true);
                currentBot.play('sBot3',true);
            } else if (i==0) {
                currentTop.play('sTop0',true);
                currentBot.play('sBot0',true)
            } else {
                currentTop.play('sTop1',true);
                currentBot.play('sBot1',true);
            }
        }
        if (this.messageT==null && this.messageB==null) {
            this.topSprites[this.mxLength-1].play('sTop3',true);
            this.bottomSprites[this.mxLength-1].play('sBot3',true);
        } else {
            this.topSprites[this.mxLength-1].play('sTop2',true);
            this.bottomSprites[this.mxLength-1].play('sBot2',true);
        }
        this.talkingT.setText(this.messageT);
        this.talkingB.setText(this.messageB);
    }    
}

class RepairTracker {
    constructor(funct,xPos,yPos,powerLevel,barChunk,scene,UR) {
        this.UR = UR;
        this.funct = funct;
        this.xPos = xPos;
        this.yPos = yPos;
        var xPB = xPos + 64;
        var yPB = yPos + 64;
        this.powerBar = new PowerBar((funct + 'Bar'),powerLevel,xPB,yPB,barChunk,scene,UR);
        scene.add.text(xPos+16, yPos + 4,funct);
        scene.add.text(xPos-24, (yPos+26),'Current');
        this.scene = scene;
    }

    getPower() {
        return this.powerBar.oldLevel;
    }

    getPowerPercentage() {
        return this.powerBar.oldLevel / this.powerBar.powerMax;
    }

    commitRepairs() {
        this.powerBar.commitRepairs();
    }

    animate() {
        this.powerBar.animate();
    }
}

class PowerButton {
    constructor(ID,xPos,yPos,raise,scene,powerBar,UR) {
        this.UR = UR;
        this.ID = ID;
        this.xPos = xPos;
        this.yPos = yPos;
        this.raise = raise;
        this.sprite = scene.add.sprite(xPos,yPos,'sysTile');
        this.powerBar = powerBar;
        this.sprite.setInteractive({cursor: 'pointer'}).on('pointerdown', () => this.changePower());
        this.scene = scene;
    }

    changePower() {
        if (this.raise) {
            this.powerBar.incrementPower();
        } else {
            this.powerBar.decrementPower();
        }
    }

    animate() {
        if (this.raise) {
            this.sprite.play('plus',true);
        } else {
            this.sprite.play('minus',true);
        }
    }

}

class RepairTotal {
    constructor(ID,powerLevel,xPos,yPos,scene,UR) {
        this.UR = UR;
        this.ID = ID;
        this.powerLevel = powerLevel;
        this.xPos = xPos;
        this.yPos = yPos;
        this.scene = scene;
        this.chunks = [];
        for (var i=0;i<25;i++) {
            var xBar = xPos + 24*i;
            this.chunks.push(scene.add.sprite(xBar,yPos,'border').setScale(0.75));
        }
        scene.add.text(xPos+160, (yPos+20),'Status of Full System Repair');
    }

    animate() {
        var powerTracker = this.powerLevel;
        for (var i=0;i<this.chunks.length; i++) {
            var currentChunk = this.chunks[i];
            if (powerTracker >= 4) {
                currentChunk.play('bar4',true);
                powerTracker -= 4;
            } else if (powerTracker==3) {
                currentChunk.play('bar3',true);
                powerTracker = 0;
            } else if (powerTracker==2) {
                currentChunk.play('bar2',true);
                powerTracker = 0;
            } else if (powerTracker==1) {
                currentChunk.play('bar1',true);
                powerTracker = 0;
            } else {
                currentChunk.play('bar0',true);
            }
        }
    }    

}

class PowerBar {
    constructor(ID,powerLevel,xPos,yPos,barChunk,scene,UR) {
        this.UR = UR;
        this.ID = ID;
        this.powerLevel = powerLevel;
        this.oldLevel = powerLevel;
        this.powerMax = barChunk*4;
        this.xPos = xPos;
        this.yPos = yPos;
        this.barChunk = [];
        this.oldChunk = [];
        this.currentSpent = 0;
        for (var i=0;i<barChunk;i++) {
            var xBar = xPos + 32*i;
            this.barChunk.push(scene.add.sprite(xBar,yPos,'border'));
        }
        for (var i=0;i<barChunk;i++) {
            var xBar = xPos + 32*i;
            var yBar = yPos - 32;
            this.oldChunk.push(scene.add.sprite(xBar,yBar,'border'));
        }
        this.moreButton = new PowerButton((ID + 'Plus'),xPos-64,yPos,true,scene,this,UR);
        this.lessButton = new PowerButton((ID + 'Minus'),xPos-32,yPos,false,scene,this,UR);
        this.scene = scene;
    }

    commitRepairs() {
        this.oldLevel = this.powerLevel;
        this.currentSpent = 0;
    }

    buildBar(power,bar) {
        var powerTracker = power;
        for (var i=0;i<bar.length; i++) {
            var currentChunk = bar[i];
            if (powerTracker >= 4) {
                currentChunk.play('bar4',true);
                powerTracker -= 4;
            } else if (powerTracker==3) {
                currentChunk.play('bar3',true);
                powerTracker = 0;
            } else if (powerTracker==2) {
                currentChunk.play('bar2',true);
                powerTracker = 0;
            } else if (powerTracker==1) {
                currentChunk.play('bar1',true);
                powerTracker = 0;
            } else {
                currentChunk.play('bar0',true);
            }
        }
    }    

    animate() {
        this.buildBar(this.powerLevel,this.barChunk);
        this.buildBar(this.oldLevel,this.oldChunk);

        this.moreButton.animate();
        this.lessButton.animate();
    }

    updatePower(powerLevel) {
        if (powerLevel < this.powerMax) {
            this.powerLevel = powerLevel;
        } else if (powerLevel < 0){
            this.powerLevel = 0;
        } else {
            this.powerLevel = this.powerMax;
        }
        this.scene.repairSound.play();
    }

    incrementPower() {
        if (this.UR.currentSpendable > 0 && (this.powerLevel + 1) <= this.powerMax) {
            this.updatePower(this.powerLevel+1);
            this.UR.currentSpendable -= 1;
            this.currentSpent += 1;
        }   
    }

    decrementPower() {
        if (this.currentSpent > 0) {
            this.updatePower(this.powerLevel-1);
            this.UR.currentSpendable += 1;
            this.currentSpent -= 1;
        }
    }
}

class AlarmPanel {
    constructor(UR) {
        this.panelLevel = 0;
        this.UR=UR;
    }
}

class UserRepair {
    constructor(scene) {
        this.roundCount = 0;
        this.currentSystemPower = 1;
        this.currentSpendable = 1;
        this.currentSpent = 0;
        this.repairRate = 1;
        this.allSystems = [];
        this.camera1 = new RepairTracker('Camera 1',c2px(1.5),c2py(0),0,2,scene,this);
        this.allSystems.push(this.camera1);
        this.camera2 = new RepairTracker('Camera 2',c2px(6.5),c2py(0),0,2,scene,this);
        this.allSystems.push(this.camera2);
        this.camera3 = new RepairTracker('Camera 3',c2px(1.5),c2py(2.5),0,2,scene,this);
        this.allSystems.push(this.camera3);
        this.camera4 = new RepairTracker('Camera 4',c2px(6.5),c2py(2.5),0,2,scene,this);
        this.allSystems.push(this.camera4);
        this.doors = new RepairTracker('Door Security',c2px(11.5),c2py(0),0,4,scene,this);
        this.allSystems.push(this.doors);
        this.database = new RepairTracker('  Database',c2px(11.5),c2py(2.5),0,4,scene,this);
        this.allSystems.push(this.database);
        this.repair = new RepairTracker('System Repair',c2px(2.5),c2py(5),0,5,scene,this);
        this.allSystems.push(this.repair);
        this.panel = new RepairTracker('Panel Access',c2px(10.5),c2py(5),0,4,scene,this);
        this.allSystems.push(this.panel);
        this.repairBar = new RepairTotal('Total',this.currentSystemPower,c2px(0),c2py(10),scene,this);
        this.blop = new Blop(c2px(0.5),c2py(8.0),scene,this);
        this.scene = scene;
        this.toMove = false;
    }

    checkPower() {
        this.blop.updatePower(this.currentSpendable);
    }

    getCameraStatus() {
        var cameraStatus = [];
        for (var i=0;i<4;i++) {
            var camPow = this.allSystems[i].getPower();
            if (camPow < 1) {
                cameraStatus.push(0);
            } else if (camPow < 3) {
                cameraStatus.push(1);
            } else if (camPow < 8) {
                cameraStatus.push(2);
            } else {
                cameraStatus.push(3);
            }
        }
        return cameraStatus;
    }

    commitRepairs() {
        this.scene.repairSound.play();
        for (var i=0;i<this.allSystems.length;i++) {
            this.allSystems[i].commitRepairs();
        }
        this.checkRepairRate();
        this.currentSpent =0;

        if(this.repairRate + this.currentSystemPower < 100) {
            this.currentSystemPower += this.repairRate;
            this.repairBar.powerLevel = this.currentSystemPower;
            this.currentSpendable = this.repairRate;
        } else {
            this.repairRate = 100 - this.currentSystemPower;
            this.currentSystemPower += this.repairRate;
            this.repairBar.powerLevel = this.currentSystemPower;
            this.currentSpendable = this.repairRate;
        }
        for (var i=0;i<SystemState.allSlimes.length;i++) {
            SystemState.allSlimes[i].move();
        }
        this.toMove = true;
    }

    checkRepairRate() {
        var repairLevel = this.repair.powerBar.powerLevel;
        if (repairLevel < 2) {
            console.log('repair level 1');
            this.repairRate = 1;
        } else if (repairLevel < 8) {
            console.log('repair level 2');
            this.repairRate = 2;
        } else if (repairLevel < 20) {
            console.log('repair level 3');
            this.repairRate = 3;
        } else {
            console.log('repair level 4');
            this.repairRate = 4;
        }
    }

    animate() {
        for (var i=0;i<this.allSystems.length;i++) {
            this.allSystems[i].animate();
        }
        this.repairBar.animate();
        this.blop.animate();
    }
}


var repairSystem;

class SystemScene extends Phaser.Scene {
    init() {
        console.log("System Scene Init");
    }

    create() {
        console.log("System Create");
        this.tabStrip = new TabStrip(this, 'System');

        this.repairSound = this.sound.add('click2');

        repairSystem = new UserRepair(this);
        SystemState.repairSystem = repairSystem;
 
        var barKeys = ['bar0','bar1','bar2','bar3','bar4'];
        var speechTopKeys = ['sTop0','sTop1','sTop2','sTop3'];
        var speechBotKeys = ['sBot0','sBot1','sBot2','sBot3'];

        for (var i=0;i<barKeys.length;i++) {
            var spriteIdx = 54 + i;

            this.anims.create({
                key: barKeys[i],
                frames: this.anims.generateFrameNumbers('border',{start:spriteIdx,end:spriteIdx}),
                frameRate: 5,
                repeat: -1
            })
        }

        //pull the speech bubble from sprite sheet
        for (var i=0;i<(speechTopKeys.length-1);i++) {
            var spriteIdx = 27 + i;

            this.anims.create({
                key: speechTopKeys[i],
                frames: this.anims.generateFrameNumbers('border',{start:spriteIdx,end:spriteIdx}),
                frameRate: 5,
                repeat: -1
            })
        }
        this.anims.create({
            key: 'sTop3',
            frames: this.anims.generateFrameNumbers('border',{start:52,end:52}),
            frameRate: 5,
            repeat: -1
        })
        for (var i=0;i<(speechBotKeys.length-1);i++) {
            var spriteIdx = 45 + i;

            this.anims.create({
                key: speechBotKeys[i],
                frames: this.anims.generateFrameNumbers('border',{start:spriteIdx,end:spriteIdx}),
                frameRate: 5,
                repeat: -1
            })
        }
        this.anims.create({
            key: 'sBot3',
            frames: this.anims.generateFrameNumbers('border',{start:52,end:52}),
            frameRate: 5,
            repeat: -1
        })



        //pull the power buttons from the sprite sheet
        this.anims.create({
            key: 'plus',
            frames: this.anims.generateFrameNumbers('sysTile',{start:185,end:185}),
            frameRate: 5,
            repeat: -1
        })
        this.anims.create({
            key: 'minus',
            frames: this.anims.generateFrameNumbers('sysTile',{start:186,end:186}),
            frameRate: 5,
            repeat: -1
        })



        //pull blop from the sprite sheet
        this.anims.create({
            key: 'helperTL',
            frames: this.anims.generateFrameNumbers('sysTile',{start:114,end:114}),
            frameRate: 5,
            repeat: -1
        })
        this.anims.create({
            key: 'helperTR',
            frames: this.anims.generateFrameNumbers('sysTile',{start:115,end:115}),
            frameRate: 5,
            repeat: -1
        })
        this.anims.create({
            key: 'helperBL',
            frames: this.anims.generateFrameNumbers('sysTile',{start:131,end:131}),
            frameRate: 5,
            repeat: -1
        })
        this.anims.create({
            key: 'helperBR',
            frames: this.anims.generateFrameNumbers('sysTile',{start:132,end:132}),
            frameRate: 5,
            repeat: -1
        })
    }

    update () {
        repairSystem.checkPower();
        repairSystem.animate();
    }
}



export default SystemScene;