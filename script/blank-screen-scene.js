/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';

class BlankScreenScene extends Phaser.Scene {
    bootingText = "Booting";
    currentTextDisplayed = "";
    characterWidth = 10;
    timePerCharacter = 250;
    cursorBlinkTime = 500;
    startPos = globalConfig.frameWidth + 10;
    booting = false;

    init() {
        console.log("Blank Screen Init");
    }
    create() {
        this.cursor = this.add.rectangle(this.startPos, this.startPos, this.characterWidth, this.characterWidth * 1.5, 0xffffff);
        this.cursor.setOrigin(0, 0);
        this.cursor.setVisible(false);
        this.bootTextDisplay = this.add.text(this.startPos, this.startPos, this.currentTextDisplayed);
        this.bootTextDisplay.setOrigin(0,0);
        this.startupSound = this.sound.add('startup');
    }
    update(time, delta) {
        const blankStart = SystemState.timeEnteredBlank;
        const cursorStart = SystemState.timeCursorStart;

        if (this.booting) {
            // noop
        } else if (cursorStart) {
            if (time - cursorStart > globalConfig.cursorTime) {
                this.booting = true;
                this.cursor.setVisible(false);
                this.bootTextDisplay.setVisible(false);
                this.startupSound.play();
                this.startupSound.on('complete', function() {
                    SystemState.boot();
                });
            } else {
                this.blinkCursor(time, cursorStart);
                this.renderText(time, cursorStart);
            }
        } else if (blankStart) {
            if (time - blankStart > globalConfig.blankScreenTime) {
                SystemState.startCursor();
            }
        }
    }

    blinkCursor(time, cursorStart) {
        const delta = time - cursorStart;

        const blinks = Math.floor(delta / this.cursorBlinkTime);
        const visible = blinks % 2 == 0;

        const characters = Math.min(Math.floor(delta / this.timePerCharacter), this.bootingText.length);

        this.cursor.setX(this.startPos + (characters * this.characterWidth));

        if (visible) {
            this.cursor.setVisible(true);
        } else {
            this.cursor.setVisible(false);
        }
    }

    renderText(time, cursorStart) {
        const delta = time - cursorStart;
        const characters = Math.min(Math.floor(delta / this.timePerCharacter), this.bootingText.length);
        const textToShow = this.bootingText.slice(0, characters);
        if (textToShow !== this.currentTextDisplayed) {
            this.currentTextDisplayed = textToShow;
            this.bootTextDisplay.setText(textToShow);
        }
    }
}

export default BlankScreenScene;