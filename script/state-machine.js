/** @type {import("../typings/phaser")} */
/** @type {import("../typings/stateMachine")} */

import MainScene from './main-scene.js';

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
    },
    methods: {
        // Game state management
        /** @param {Phaser.Game} game */
        setGame: function(game) { this.game = game; },

        onGameStart: function() {
            this.game.scene.add('mainScene', MainScene, true);
            this.game.scene.remove('menu');
        },
    }
});

export default SystemState;