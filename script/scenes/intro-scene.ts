import Phaser from 'phaser';
import WebFont from 'webfontloader';
import {screenHeight} from '../helpers/global-config';
import SystemState from '../helpers/state-machine';

// @ts-ignore
import AudioWide from '../../assets/AudioWide-Regular.ttf'

enum Actions {
    IDLE = 'idle',
    FADING_IN = 'fading_in',
    FADING_OUT = 'fading_out',
    SHOWN = 'shown',
};

const FadeTime = 500;

interface IntroScreen {
    image: string;
    text: string;
    audio: string;
};
interface IntroState {
    currentIndex: number;
    action: Actions;
    opacity: number;
};
type InputMap = {
    E: Phaser.Input.Keyboard.Key;
    SPACE: Phaser.Input.Keyboard.Key;
    ENTER: Phaser.Input.Keyboard.Key;
}

class IntroScene extends Phaser.Scene {
    screens: IntroScreen[];
    state: IntroState;
    gamepadWasDown: boolean;
    fontStyle: Partial<Phaser.GameObjects.TextStyle>;
    image: Phaser.GameObjects.Sprite;
    text: Phaser.GameObjects.Text;

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
            strokeThickness: 3,
        };
        this.gamepadWasDown = false;

        WebFont.load({
            custom: { families: ['Audiowide'], urls: [AudioWide] },
            active: () => {
                this.input.on('pointerdown', this.advance);

                const input = this.input.keyboard.addKeys('SPACE,ENTER,E') as InputMap;
                input.ENTER.on('down', this.advance);
                input.SPACE.on('down', this.advance);
                input.E.on('down', this.advance);

                this.advance();
            }
        });
    }
    update(_:number, delta:number) {
        const gamepad = this.input.gamepad.getPad(0);
        const gamepadDown = gamepad && (gamepad.A || gamepad.buttons[9].value === 1)

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
    fadeIn(delta:number) {
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
    fadeOut(delta:number) {
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