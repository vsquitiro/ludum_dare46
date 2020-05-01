import Phaser from 'phaser';
import SystemState from "./helpers/state-machine";
import config from './helpers/global-config';
import loader from './scenes/loader-scene';
import Menu from './scenes/menu-scene';
import AudioScene from "./scenes/audio-scene";

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