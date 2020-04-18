/** @type {import("../typings/phaser")} */

import {screenHeight, screenWidth} from './global-config.js';
import SystemState from './state-machine.js';

class MenuScene extends Phaser.Scene {
    init() {
        console.log("Menu Init");
    }
    create() {
        console.log("Menu Create");
        var text = this.add.text(screenWidth/2, screenHeight/2, 'Click Anywhere to Start');
        text.setOrigin(0.5, 0.5);

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
    }
}

export default MenuScene;

