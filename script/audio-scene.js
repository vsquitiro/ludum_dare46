/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';

class AudioScene extends Phaser.Scene {
    create() {
        this.mainLoop = this.sound.add('mainLoop');
    }
    update(time, delta) {
        if (!this.mainLoop.isPlaying) {
            this.mainLoop.play();
        }
    }
}

export default AudioScene;