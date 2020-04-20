/** @type {import("../typings/phaser")} */

import SystemState from "./state-machine.js";
import config from './global-config.js';
import loader from './loader-scene.js';
import Menu from './menu-scene.js';
import AudioScene from "./audio-scene.js";

const gameConfig = {
    type: Phaser.AUTO,
    parent: "game-container",
    width: config.screenWidth,
    height: config.screenHeight,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            gravity: {y:0}
        },
    },
    input: {
        gamepad: true,
    }
};

const game = new Phaser.Game(gameConfig);

game.scene.add('loader', loader, true);
game.scene.add('audio', AudioScene, false);
game.scene.add('menu', Menu, false);

SystemState.setGame(game);