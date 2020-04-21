/** @type {import("../typings/phaser")} */
/** @type {import("../typings/stateMachine")} */

import MainScene from './main-scene.js';
import OverlayScene from './overlay-scene.js';
import globalConfig from './global-config.js';
import { Simulation } from './simulation.js';
import PauseScene from './pause-scene.js';
import WinScene from './win-scene.js';
import LoseScene from './lose-scene.js';
import IntroScene from './intro-scene.js';

//States
const menu = "menu",
      main = "main",
      pause = "pause",
      win = "win",
      lose = "lose",
      intro = "intro";

/**
 * @property {Phaser.Game} game
 */
const SystemState = new StateMachine({
    init: menu,
    transitions: [
        { name: 'gameStart', from: menu, to: intro },
        { name: 'introComplete', from: intro, to: main },
        { name: 'pause', from: main, to: pause },
        { name: 'unpause', from: pause, to: main },
        { name: 'winGame', from: main, to: win},
        { name: 'loseGame', from: main, to: lose},
    ],
    data: {
        /** @type {Phaser.Game} */
        game: null,
        showBar: false,
        isPaused: false,
        runSimulation: false,
        enableChaos: false,
        eventsComplete: [],
        currentEvent: null,
        enableSprings: false,
        enabelFilling: false,
        winState: {
            win: false,
            lose: false,
        },
        allowMovement: false,
        allowInteraction: false,
        allowMessageInteraction: true,
        lastMessageCheckTime: 0,
        plantings: 0,
        feedings: 0,
        fills: 0,
        primings: 0,
        vat: {
            currentUnits: 1000,
            taped: false,
            draining: false,
        },
        god: {
            level: 0,
            exp: 0,
            hunger: 0,
            tantrum: false,
            teaching: true,
        },
        minions: {
            count: 0,
            level: 0,
        },
        farm: [],
        fountain: [],
        tools: {
            level:0,
        },
        inventory: {
            showFood: false,
            showFuel: false,
            showFert: false,
            showBuilding: false,
            food: 0,
            fuel: 0,
            fert: 0,
            building: 0,
        },
        message: {
            current: null,
            shown: 0,
            playing: false,
        },
        currentInstruction: null,
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
            godState.inTantrum = godState.hunger > godState.tantrumThreshold;
            return godState;
        },
        getCurrentFarmState: function() {
            const farmState = this.farm.map((value,idx)=>{
                const plot = {...value};
                Object.assign(plot, globalConfig.farmLevels[value.farmLevel]);
                //Return when building is implemented
                // Object.assign(plot, globalConfig.irrigationLevels[value.irrigationLevel]);
                return plot;
            });
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

        addPlot(id) {
            this.farm.push({
                id: id,
                farmExp:0,
                planted:false,
                growing:false,
                harvestable:false,
                progress:0,
                currentUnits:0,
                fert:false,
                fertTimeRemain:0,
                farmLevel:0,
                irrigationLevel:0,
            });
        },

        addSpring(id) {
            this.fountain.push({
                id: id,
                rateExp: 0,
                rateLevel: 0,
                planted: false,
                progress: 0,
                currentUnits: 0,
                capacityLevel: 0,
            });
        },

        getCurrentFountainState: function() {
            const fountainState = this.fountain.map((value,idx)=>{
                const spring = {...value};
                //Return when building is implemented
                // Object.assign(spring, globalConfig.capacityLevels[value.capacityLevel]);
                Object.assign(spring, globalConfig.rateLevels[value.rateLevel]);
                return spring;
            });
            return fountainState;
        },

        // Transition handlers
        onLeaveMenu: function() {
            this.game.scene.remove('menu');
        },

        onLeaveIntro: function() {
            this.game.scene.remove('intro');
        },

        onEnterPause: function() {
            console.log("Paused");
            this.isPaused = true;
            this.runSimulation = false;
            this.allowInteraction = false;
            this.allowMessageInteraction = false;
            this.allowMovement = false;
            this.game.scene.add('pauseScene', PauseScene, true);
        },

        onLeavePause: function() {
            console.log('Unpaused');
            this.isPaused = false;
            this.runSimulation = true;
            this.allowInteraction = true;
            this.allowMessageInteraction = true;
            this.allowMovement = true;
            this.game.scene.remove('pauseScene');
        },

        onGameStart: function() {
            this.game.scene.add('intro', IntroScene, true);
        },

        onIntroComplete: function() {
            this.game.scene.add('mainScene', MainScene, true);
            this.game.scene.add('overlayScene', OverlayScene, true);
        },

        onWinGame: function() {
            console.log("win");
            this.game.scene.add('winScene', WinScene, true);
            this.game.scene.remove('mainScene');
            this.game.scene.remove('overlayScene');

        },

        onLoseGame: function() {
            console.log("lose");
            this.game.scene.add('loseScene', LoseScene, true);
            this.game.scene.remove('mainScene');
            this.game.scene.remove('overlayScene');
        }
    }
});

export default SystemState;