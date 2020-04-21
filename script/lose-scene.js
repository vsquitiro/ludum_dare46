/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';

class LoseScene extends Phaser.Scene {
    create() {
        const { screenHeight, screenWidth } = globalConfig;

        const background = this.add.rectangle(0, 0, screenWidth, screenHeight, 0x000000, 0.5);
        background.setOrigin(0, 0);

        const text = this.add.text(screenWidth/2, screenHeight/3, "*gasp* You’ve killed me. *wheeze*\nYou’ve killed me. I do not\nknow why I expected more from\na puny being as yourself. I am taking\nyou with me into the abyss of eternity.\nBut not, like, with me. Just\ncome here so I can destroy you.");
        text.setFontFamily('Audiowide, Helvetica, Verdana, Sans');
        text.setFontSize(30);
        text.setAlign('center');
        text.setOrigin(0.5, 0,5);
    }
}

export default LoseScene;