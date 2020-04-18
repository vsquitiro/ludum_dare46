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
    }
}

export default OverlayScene;