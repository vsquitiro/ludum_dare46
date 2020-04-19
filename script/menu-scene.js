/** @type {import("../typings/phaser")} */

import {screenHeight, screenWidth} from './global-config.js';
import SystemState from './state-machine.js';

class MenuScene extends Phaser.Scene {
    init() {
        console.log("Menu Init");
    }
    create() {
        console.log("Menu Create");
        WebFont.load({
            custom: {
                families: ['Audiowide'],
            },
            active: () => {
                var text = this.add.text(screenWidth/2, screenHeight/2, 'WHY BABY?');
                text.setFontSize(80);
                text.setFontFamily('Audiowide, Helvetica, Verdana, Sans');
                text.setOrigin(0.5, 0.5);
            }
        });

        this.shortcutZone = this.add.zone(24 * 32, 18 * 32, 1 * 32, 1 * 32).setOrigin(0).setName('shortcut');
        this.shortcutZone.setInteractive({cursor: 'pointer'});

        this.input.on('gameobjectdown', function(pointer, gameObject) {
            if (gameObject.name == "shortcut") {
                SystemState.shortcut();
            }
        }, this);
        this.input.once('pointerdown', function() {
            console.log("Clicked, starting game");

            if (SystemState.state == "menu") {
                SystemState.gameStart();
            }
        }, this);

        this.input.keyboard.addKey('SPACE,ENTER', () => {
            if (SystemState.state == "menu") {
                SystemState.gameStart();
            }
        })
    }

    update() {
        const gamepad = this.input.gamepad.getPad(0);

        if (gamepad && (gamepad.A || gamepad.buttons[9].val === 1) && SystemState.state === "menu") {
            SystemState.gameStart();
        }
    }
}

export default MenuScene;

