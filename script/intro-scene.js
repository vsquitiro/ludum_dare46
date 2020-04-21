/** @type {import("../typings/phaser")} */

import {screenWidth, screenHeight} from './global-config.js';
import SystemState from './state-machine.js';

const Actions = {
    IDLE: 'idle',
    FADING_IN: 'fading_in',
    FADING_OUT: 'fading_out',
    SHOWN: 'shown',
};

const FadeTime = 500;

class IntroScene extends Phaser.Scene {
    create() {
        this.screens = [
            {
                image: null,
                text: "*CRASH* *SPLASH*",
                audio: null,
            },
            {
                image: null,
                text: "WHAT HAVE YOU DONE YOU CLUMSY MORTAL?!?!\nWHAT HAVE YOU DONE TO THE ALL-POWERFUL SERPENS?!",
                audio: null,
            },
            {
                image: null,
                text: "HELP ME INTO THIS VAT!",
                audio: null,
            },
        ];
        this.state = {
            currentIndex: -1,
            action: Actions.IDLE,
            opacity: 1,
        };
        this.fontStyle = {
            fontFamily: 'Audiowide, Helvetica, sans',
            fontSize: '20px',
            color: '#fff',
            stroke: '#000',
            strokeThickness: '3',
        };
        this.gamepadWasDown = false;

        WebFont.load({
            custom: { families: ['Audiowide'] },
            active: () => {
                this.input.on('pointerdown', this.advance);

                const input = this.input.keyboard.addKeys('SPACE,ENTER,E');
                input.ENTER.on('down', this.advance);
                input.SPACE.on('down', this.advance);
                input.E.on('down', this.advance);

                this.advance();
            }
        });
    }
    update(time, delta) {
        const gamepad = this.input.gamepad.getPad(0);
        const gamepadDown = gamepad && (gamepad.A || gamepad.buttons[9].val === 1)

        if (!this.gamepadWasDown && gamepadDown && this.state.currentIndex > -1) {
            this.advance();
        }

        this.gamepadWasDown = gamepadDown;

        this.fadeIn(delta);
        this.fadeOut(delta);
    }
    advance = () => {
        switch (this.state.action) {
        case Actions.IDLE:
            this.state.currentIndex += 1;
            this.showScreen();
            break;
        case Actions.FADING_IN:
            this.state.opacity = 1;
            break;
        case Actions.FADING_OUT:
            this.state.currentIndex += 1;
            if (this.state.currentIndex >= this.screens.length) {
                this.startGame();
            } else {
                this.showScreen();
            }
            break;
        case Actions.SHOWN:
            this.state.action = Actions.FADING_OUT;
            break;
        }
    }
    showScreen() {
        this.image && this.image.destroy();
        this.text && this.text.destroy();

        this.state.opacity = 0;
        const screen = this.screens[this.state.currentIndex];
        if (screen.image) {
            //TODO: Show image if we get some
        }
        if (screen.text) {
            this.text = this.add.text( 50, screenHeight * (0.75), screen.text, this.fontStyle);
            this.text.setAlpha(0);
        }
        this.state.action = Actions.FADING_IN;
    }
    fadeIn(delta) {
        if (this.state.action !== Actions.FADING_IN) return;
        if (this.state.opacity >= 1) {
            this.state.opacity = 1;
            this.state.action = Actions.SHOWN;
        } else {
            this.state.opacity += (delta / FadeTime);
        }
        this.text && this.text.setAlpha(this.state.opacity);
        this.image && this.image.setAlpha(this.state.opacity);
    }
    fadeOut(delta) {
        if (this.state.action !== Actions.FADING_OUT) return;
        if (this.state.opacity <= 0) {
            this.state.opacity = 0;
            this.advance();
        } else {
            this.state.opacity -= (delta / FadeTime);
        }
        this.text && this.text.setAlpha(this.state.opacity);
        this.image && this.image.setAlpha(this.state.opacity);
    }
    startGame = () => {
        if (SystemState.state === 'intro') {
            SystemState.introComplete();
        }
    }
}

export default IntroScene;