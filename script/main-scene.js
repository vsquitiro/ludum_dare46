/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';

class MainScene extends Phaser.Scene {
    init() {
        console.log("Main Scene Init");
    }
    create() {
        // What to create?
    }
    update(time, delta) {
        
    }
}

export default MainScene;