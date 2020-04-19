/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';

const border = 20;
const center = globalConfig.screenWidth*1/50;
const width = (globalConfig.screenWidth*1/4) - border;
const height = 40;

class OverlayScene extends Phaser.Scene {
    init() {
        console.log("Overlay Scene Init");
        this.timeSinceLastLetter = 0;
        this.timePerLetter = 50;
    }
    create() {
        this.vatBarBG = this.add.rectangle(center, border, width, height, 0x000000);
        this.vatBarBG.setOrigin(0, 0);
        this.vatBarBG.setStrokeStyle(4, 0xffffff);
        this.vatBarBG.visible = false;
        this.vatBarBG.depth = 90;

        this.vatBarInner = this.add.rectangle(center + 2, border + 2, width - 4, height - 4, 0x6495ed);
        this.vatBarInner.setOrigin(0, 0);
        this.vatBarInner.visible = false;
        this.vatBarInner.depth = 100;

        this.messageBox = this.add.sprite(border, 400, 'textBox');
        this.messageBox.setOrigin(0, 0);
        this.messageBox.displayWidth = globalConfig.screenWidth - border * 2;
        this.messageBox.displayHeight = this.messageBox.displayWidth * .22;
        this.messageBox.visible = false;
        
        this.message = this.add.text(250, 425, '');
        this.message.setOrigin(0, 0);
        this.message.setFontSize(25);
        this.message.setColor('black');
        this.message.width = 550;
        this.message.height = 150;

        this.instruction = this.add.text(border, 70, null);
        this.instruction.setFontFamily('Helvetica, Verdana, Sans');
        this.instruction.setFontSize(20);
        this.instruction.setColor('white');
        this.instruction.setStroke('black', 2);
        this.instruction.setShadow(1, 1, '#222222', 1, true, false);
        this.instruction.visible = false;
    }

    update(time, delta) {
        if (SystemState.showBar) {
            this.vatBarBG.visible = true;
            this.vatBarInner.visible = true;
        }
        const vatState = SystemState.getCurrentVatState();
        var updateWidth = width * globalConfig.vatLevels[SystemState.god.level].maxUnits/1000
        if (updateWidth !=this.vatBarBG.width) {
            this.vatBarBG = this.add.rectangle(center, border, updateWidth, height, 0x000000);
            this.vatBarBG.setOrigin(0, 0);
            this.vatBarBG.setStrokeStyle(4, 0xffffff);
            this.vatBarBG.depth = 90;
        }
        this.vatBarInner.width = (this.vatBarBG.width - 4) * vatState.percentage;

        this.showMessage(delta);
        this.showInstruction();
    }

    showMessage(delta) {
        if (SystemState.message.current) {
            this.messageBox.visible = true;
            this.message.visible = true;

            this.message.text = SystemState.message.current.slice(0, SystemState.message.shown);

            if (SystemState.message.playing && !SystemState.isPaused) {
                // make sure beeps are playing
                this.timeSinceLastLetter += delta;
                if (this.timeSinceLastLetter >= this.timePerLetter) {
                    this.timeSinceLastLetter -= this.timePerLetter;
                    SystemState.message.shown += 1;

                    if (SystemState.message.shown >= SystemState.message.current.length) {
                        SystemState.message.playing = false;
                    }
                }
            }
        } else {
            this.timeSinceLastLetter = 0;
            this.messageBox.visible = false;
            this.message.visible = false;
        }
    }

    showInstruction() {
        if (SystemState.currentInstruction) {
            this.instruction.text = "Interact to " + SystemState.currentInstruction;
            this.instruction.visible = true;
        } else {
            this.instruction.visible = false;
        }
    }
}

export default OverlayScene;