/** @type {import("../typings/phaser")} */
/** @type {import("../typings/stateMachine")} */

import MainScene from './main-scene.js';
import OverlayScene from './overlay-scene.js';
import globalConfig from './global-config.js';
import { Simulation } from './simulation.js';
import PauseScene from './pause-scene.js';

//States
const menu = "menu",
      main = "main",
      pause = "pause";

/**
 * @property {Phaser.Game} game
 */
const SystemState = new StateMachine({
    init: menu,
    transitions: [
        { name: 'gameStart', from: menu, to: main },
        { name: 'pause', from: main, to: pause },
        { name: 'unpause', from: pause, to: main },
    ],
    data: {
        /** @type {Phaser.Game} */
        game: null,
        showBar: true,
        isPaused: false,
        runSimulation: true,
        allowMovement: true,
        allowInteraction: true,
        vat: {
            currentUnits: 100,
        },
        god: {
            level: 0,
            exp: 0,
            hunger: 0,
        },
        minions: {
            count: 0,
            level: 0,
        },
        farm: {
            level: 0,
            plots: [],
        },
        inventory: {
            level: 0,
            item0: 0,
            item1: 0,
            item2: 0,
        },
        simulation: new Simulation(),
    },
    methods: {
        // Game state management
        /** @param {Phaser.Game} game */
        setGame: function(game) { this.game = game; },
        getCurrentVatState: function() {
            const vatState = { ...this.vat };
            Object.assign(vatState, globalConfig.vatLevels[this.god.level]);
            vatState.percentage = vatState.currentUnits / vatState.maxUnits;
            return vatState;
        },

        // Transition handlers
        onLeaveMenu: function() {
            this.game.scene.remove('menu');
        },

        onEnterPause: function() {
            console.log("Paused");
            this.isPaused = true;
            this.runSimulation = false;
            this.allowInteraction = false;
            this.allowMovement = false;
            this.game.scene.add('pauseScene', PauseScene, true);
        },

        onLeavePause: function() {
            console.log('Unpaused');
            this.isPaused = false;
            this.runSimulation = true;
            this.allowInteraction = true;
            this.allowMovement = true;
            this.game.scene.remove('pauseScene');
        },

        onGameStart: function() {
            this.game.scene.add('mainScene', MainScene, true);
            this.game.scene.add('overlayScene', OverlayScene, true);
        },
    }
});

export default SystemState;