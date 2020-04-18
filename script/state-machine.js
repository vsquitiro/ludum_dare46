/** @type {import("../typings/phaser")} */
/** @type {import("../typings/stateMachine")} */

import MainScene from './main-scene.js';
import OverlayScene from './overlay-scene.js';
import globalConfig from './global-config.js';
import { Simulation } from './simulation.js';

//States
const menu = "menu",
      main = "main";

/**
 * @property {Phaser.Game} game
 */
const SystemState = new StateMachine({
    init: menu,
    transitions: [
        { name: 'gameStart', from: menu, to: main }
    ],
    data: {
        /** @type {Phaser.Game} */
        game: null,
        showBar: true,
        runSimulation: true,
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

        onGameStart: function() {
            this.game.scene.add('mainScene', MainScene, true);
            this.game.scene.add('overlayScene', OverlayScene, true);
        },
    }
});

export default SystemState;