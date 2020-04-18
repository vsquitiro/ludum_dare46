/** @type {import("../typings/phaser")} */
/** @type {import("../typings/stateMachine")} */

import globalConfig from './global-config.js';
import DebugScene from './debug.js';
import BlankScreenScene from './blank-screen-scene.js';
import FrameScene from './frame-scene.js';
import SystemScene from './system-scene.js';
import LoginScene from './login-scene.js';
import CameraScene from './camera-scene.js';
import {SlimeData} from './slime-creator.js';
import DirectoryScene from './directory-scene.js';


//States
const menu = "menu",
      debug = "debug",
      blankScreen = "blankScreen",
      login = "loginScreen",
      camera = "camera",
      directory = "directory",
      system = "system",
      comms = "comms";

const SystemState = new StateMachine({
    init: menu,
    transitions: [
        { name: 'gameStart', from: menu, to: blankScreen },
        { name: 'shortcut', from: menu, to: camera },
        { name: 'debugTest', from: menu, to: debug },
        { name: 'boot', from: blankScreen, to: login },
        { name: 'login', from: login, to: camera },
        { name: 'viewCameras', from: [directory, system, comms], to: camera },
        { name: 'viewDirectory', from: [camera, system, comms], to: directory },
        { name: 'viewSystem', from: [directory, camera, comms], to: system },
        // { name: 'viewSystem', from: menu, to: system},
        { name: 'viewComms', from: [directory, system, camera], to: comms },
        //win
        //lose
    ],
    data: {
        game: null,
        timeEnteredBlank: null,
        timeCursorStart: null,
        timeLoginStart: null,
        lightsOn: false,
        repairSystem: null,
    },
    methods: {
        // Game state management
        setGame: function(game) { this.game = game; },
        startCursor: function() { this.timeCursorStart = performance.now(); },

        // Transition handlers
        onLeaveMenu: function() {
            this.game.scene.remove('menu');
        },
        onDebugTest: function() {
            this.game.scene.add('debugScene', DebugScene, true);
        },
        onShortcut: function() {
            this.allSlimes = createSlimes(12);
            this.currentScreen = camera;
            this.game.scene.add('cameraScene', CameraScene, true);
            this.game.scene.add('systemScene', SystemScene, false);
            this.game.scene.add('directoryScene', DirectoryScene, false);
            this.game.scene.add('frameScene', FrameScene, true);
            this.timeLoginStart = performance.now() - globalConfig.lightOffTime;

            this.game.scene.bringToTop('frameScene');
        },
        onGameStart: function() {
            this.game.scene.add('blankScreenScene', BlankScreenScene, true);
            this.game.scene.add('frameScene', FrameScene, true);

            this.timeEnteredBlank = performance.now();
        },
        onLeaveBlankScreen: function() {
            this.game.scene.remove('blankScreenScene');
        },
        onBoot: function() {
            this.game.scene.add('loginScene', LoginScene, true);
            this.game.scene.bringToTop('frameScene');

            this.timeLoginStart = performance.now();
        },
        onLeaveLoginScreen: function() {
            this.game.scene.remove('loginScene');
        },
        onLogin: function() {

            this.allSlimes = createSlimes(12);
            this.currentScreen = camera;
            this.game.scene.add('cameraScene', CameraScene, true);
            this.game.scene.add('systemScene', SystemScene, false);
            this.game.scene.add('directoryScene', DirectoryScene, false);

            this.game.scene.bringToTop('frameScene');
        },
        onViewCameras: function() {
            this.game.scene.switch(this.currentScreen + "Scene", 'cameraScene');
            this.currentScreen = camera;
        },
        onViewDirectory: function() {
            this.game.scene.switch(this.currentScreen + "Scene", 'directoryScene');
            this.currentScreen = directory;
        },
        onViewSystem: function() {
            this.game.scene.switch(this.currentScreen + "Scene", 'systemScene');
            this.currentScreen = system;
        },
        onViewComms: function() {

        },
    }
});

function createSlimes(count) {
    var slimeArray = [];
    for (var i=0;i<count;i++) {
        slimeArray.push(new SlimeData(i,false));
    }
    return slimeArray;
}

export default SystemState;