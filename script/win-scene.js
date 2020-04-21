/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';

class WinScene extends Phaser.Scene {
    create() {
        const { screenHeight, screenWidth } = globalConfig;

        const background = this.add.rectangle(0, 0, screenWidth, screenHeight, 0x000000, 0.5);
        background.setOrigin(0, 0);

        const text = this.add.text(screenWidth/2, screenHeight/2, 'MUAHAHAH! I, SERPENS, HAVE\nRETURNED TO FULL STRENGTH\nAND POWER!!');
        text.setFontFamily('Audiowide, Helvetica, Verdana, Sans');
        text.setFontSize(35);
        text.setAlign('center');
        text.setOrigin(0.5, 0,5);
    }
}

export default WinScene;