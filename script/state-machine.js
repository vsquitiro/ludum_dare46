/** @type {import("../typings/phaser")} */
/** @type {import("../typings/stateMachine")} */

import MainScene from './main-scene.js';

//States
const menu = "menu",
      main = "main";

const SystemState = new StateMachine({
    init: menu,
    transitions: [
        { name: 'gameStart', from: menu, to: main }
    ],
    data: {
        game: null,
    },
    methods: {
        // Game state management
        setGame: function(game) { this.game = game; },

        onGameStart: function() {
            this.game.scene.add('mainScene', MainScene, true);
        },
    }
});

export default SystemState;