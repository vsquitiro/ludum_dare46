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
        winState: {
            win: false,
            lose: false,
        },
        allowMovement: true,
        allowInteraction: true,
        vat: {
            currentUnits: 1000,
            taped: false,
        },
        god: {
            level: 0,
            exp: 0,
            hunger: 0,
            tantrum: false,
        },
        minions: {
            count: 0,
            level: 0,
        },
        farm: {
            plots: [
            //{exp:0,planted:false,progress:0,currentUnits:0,fert:false,fertTimeRemain:0,farmLevel:0,irrigationLevel:0}
            {
                exp:0,
                planted:false,
                harvest:false,
                progress:0,
                currentUnits:0,
                fert:false,
                fertTimeRemain:0,
                farmLevel:0,
                irrigationLevel:0,
            }
            ]
        },
        fountain: {
            springs: [
            //{exp:0,progress:0,currentUnits:0,capacityLevel:0,rateLevel:0}
            ]
        },
        tools: {
            level:0,
        },
        inventory: {
            level: 0,
            item0: 0,
            item1: 0,
            item2: 0,
        },
        message: {
            current: null,
            shown: 0,
            playing: false,
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
        getCurrentGodState: function() {
            const godState = {...this.god};
            Object.assign(godState, globalConfig.godLevels[this.god.level]);
            godState.hungerPercentage = godState.hunger/godState.maxHunger;
            return godState;
        },
        getCurrentFarmState: function() {
            const farmState = {...this.farm};
            farmState.plots.forEach((value,idx) => {
                Object.assign(value, globalConfig.farmLevels[value.farmLevel]);
                Object.assign(value, globalConfig.irrigationLevels[value.irrigationLevel]);
            });
            Object.assign(farmState, globalConfig.farmLevels[this.farm.level])
            return farmState;
        },

        displayMessage: function(message) {
            this.message.current = message;
            this.message.shown = 0;
            this.message.playing = true;
        },
        skipMessage: function() {
            if (this.message.current) {
                this.message.shown = this.message.current.length;
                this.message.playing = false;
            }
        },
        dismissMessage: function() {
            this.message.current = null;
            this.message.shown = 0;
            this.message.playing = false;
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