/** @type {import("../typings/phaser")} */
/** @type {import("../typings/stateMachine")} */

import MainScene from './main-scene.js';
import OverlayScene from './overlay-scene.js';
import globalConfig from './global-config.js';

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
        }
    },
    methods: {
        // Game state management
        /** @param {Phaser.Game} game */
        setGame: function(game) { this.game = game; },
        updateVatLevel: function(deltaTime) {
            if (this.runSimulation) {
                const vatState = this.getCurrentVatState();
                const updatedUnits = vatState.currentUnits - (vatState.drainRate * (deltaTime / 1000));
                this.vat.currentUnits = Math.max(0, updatedUnits);
            }
        },
        getCurrentVatState: function() {
            const vatState = { ...this.vat };
            Object.assign(vatState, globalConfig.godLevels[this.god.level].vat);
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