import Phaser from 'phaser';
import SystemState from "./state-machine";
import config from './global-config';
import loader from './loader-scene';
import Menu from './menu-scene';
import AudioScene from "./audio-scene";

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