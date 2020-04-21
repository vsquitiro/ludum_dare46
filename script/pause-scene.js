/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';

class PauseScene extends Phaser.Scene {
    create() {
        const { screenHeight, screenWidth } = globalConfig;

        const background = this.add.rectangle(0, 0, screenWidth, screenHeight, 0x000000, 0.5);
        background.setOrigin(0, 0);

        const text = this.add.text(screenWidth/2, screenHeight/2, 'Paused');
        text.setFontFamily('Audiowide, Helvetica, Verdana, Sans');
        text.setFontSize(100);
        text.setOrigin(0.5, 0.5);
    }
}

export default PauseScene;