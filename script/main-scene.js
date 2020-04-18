/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';

game.pyshics.startSystem(Phaser.Physics.ARCADE);

class MainScene extends Phaser.Scene {
    init() {
        console.log("Main Scene Init");
    }
    create() {
        // What to create?
        this.map = this.game.add.tilemap('testLevel');
        this.map.addTilesetImage('White Tiles', 'gameTiles')
    }
    update(time, delta) {
        
    }
}

export default MainScene;