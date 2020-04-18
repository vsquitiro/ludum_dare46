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
        winState: {
            win: false,
            lose: false,
        },
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
        farms: {
            plots: [
            //{exp:0,planted:false,progress:0,currentUnits:0,fert:false,fertTimeRemain:0,farmLevel:0,irrigationLevel:0}
            {
                exp:0,
                planted:false,
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

        getCurrentFarmsState: function() {
            const farmsState = {...this.farms};
            farmsState.plots.forEach((value,idx) => {
                Object.assign(value, globalConfig.farmLevels[value.farmLevel]);
                Object.assign(value, globalConfig.irrigationLevels[value.irrigationLevel]);
            });
            Object.assign(farmsState, globalConfig.farmLevels[this.farms.level])
            return farmsState;
        }

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