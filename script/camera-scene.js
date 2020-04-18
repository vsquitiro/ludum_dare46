/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';
import {c2px, c2py} from './inner-screen-positions.js';
import TabStrip from './tab-strip.js';
import {SlimeData, SlimeVisual, StaticSlimeVisual} from './slime-creator.js';

var slimeDisplay;
var staticSlimeDisplay;
var cameraStatus;
var room1;
var room2;
var roomList = [];

class Room {
    constructor(ID,xPos,yPos,cams,scene) {
        this.ID = ID;
        this.xPos = xPos;
        this.yPos = yPos;
        this.scene = scene;
        this.cams = cams;
        this.camLevel = 0;
        this.camShowing = 0;
    }

    updatePower(power) {
        this.camLevel = power;
        if (power < 1) {
           const choice = Math.random();
            if (choice < 0.5) {
                this.showCam(0);
            } else {
                this.showCam(1);
            }
        } else if (power < 2) {
            const choice = Math.random();
            if (choice < 0.5) {
                this.showCam(2);
            } else {
                this.showCam(3);
            }
        } else {
            this.showCam(4);
        }
    }

    showCam(level) {
        for (var i=0;i<this.cams.length;i++) {
            if (i==level) {
                this.cams[i].setVisible(true);
                this.camShowing = i;
            } else {
                this.cams[i].setVisible(false);
            }
        }
    }
}



class CameraScene extends Phaser.Scene {
    create() {

        this.room1Map = this.make.tilemap({key: "cameraTilemap"});
        const tileset1 = this.room1Map.addTilesetImage('Cameratiles','cameraTiles');
        this.room1Static1 = this.room1Map.createStaticLayer('Static1',tileset1,c2px(0),c2py(0));
        this.room1Static2 = this.room1Map.createStaticLayer('Static2',tileset1,c2px(0),c2py(0)).setVisible(false);
        this.room1First1 = this.room1Map.createStaticLayer('Cam1Level1',tileset1,c2px(0),c2py(0)).setVisible(false);
        this.room1First2 = this.room1Map.createStaticLayer('Cam1Level2',tileset1,c2px(0),c2py(0)).setVisible(false);
        this.room1Second = this.room1Map.createStaticLayer('Cam1Level3',tileset1,c2px(0),c2py(0)).setVisible(false);

        this.room2Map = this.make.tilemap({key: "cameraTilemap"});
        const tileset2 = this.room2Map.addTilesetImage('Cameratiles','cameraTiles');
        this.room2Static1 = this.room2Map.createStaticLayer('Static3',tileset2,c2px(9),c2py(0));
        this.room2Static2 = this.room2Map.createStaticLayer('Static4',tileset2,c2px(9),c2py(0));
        this.room2First1 = this.room2Map.createStaticLayer('Cam2Level1',tileset2,c2px(9),c2py(0));
        this.room2First2 = this.room2Map.createStaticLayer('Cam2Level2',tileset2,c2px(9),c2py(0));
        this.room2Second = this.room2Map.createStaticLayer('Cam2Level3',tileset2,c2px(9),c2py(0));

        this.r1cams = [];
        this.r1cams.push(this.room1Static1);
        this.r1cams.push(this.room1Static2);
        this.r1cams.push(this.room1First1);
        this.r1cams.push(this.room1First2);
        this.r1cams.push(this.room1Second);

        this.r2cams = [];
        this.r2cams.push(this.room2Static1);
        this.r2cams.push(this.room2Static2);
        this.r2cams.push(this.room2First1);
        this.r2cams.push(this.room2First2);
        this.r2cams.push(this.room2Second);

        room1 = new Room(1,c2px(0),c2py(0),this.r1cams,this);
        room2 = new Room(2,c2px(0),c2py(0),this.r2cams,this);

        roomList.push(room1);
        roomList.push(room2);

        this.tabStrip = new TabStrip(this, 'Cameras');
        var cam1 = this.add.rectangle(c2px(0), c2py(0), 9*32, 5*32);
        cam1.setStrokeStyle(2, 0xffffff);
        cam1.setOrigin(0, 0);
        var cam2 = this.add.rectangle(c2px(9), c2py(0), 9*32, 5*32);
        cam2.setStrokeStyle(2, 0xffffff);
        cam2.setOrigin(0, 0);
        var cam3 = this.add.rectangle(c2px(0), c2py(5), 9*32, 5*32);
        cam3.setStrokeStyle(2, 0xffffff);
        cam3.setOrigin(0, 0);
        var cam4 = this.add.rectangle(c2px(9), c2py(5), 9*32, 5*32);
        cam4.setStrokeStyle(2, 0xffffff);
        cam4.setOrigin(0, 0);

        slimeDisplay = visualSlimeArray(SystemState.allSlimes,this);
        staticSlimeDisplay = visualStaticSlimeArray(SystemState.allSlimes,this);
    }

    update(time, delta) {
        if(SystemState.repairSystem) {
            cameraStatus = SystemState.repairSystem.getCameraStatus();

            for (var i=0;i<roomList.length;i++) {
                roomList[i].updatePower(cameraStatus[i]);
            }            

            for (var i=0;i<slimeDisplay.length;i++) {
                if (SystemState.repairSystem.toMove) {
                    slimeDisplay[i].updatePosition(SystemState.allSlimes[i]);
                    staticSlimeDisplay[i].updatePosition(SystemState.allSlimes[i]);
                    slimeDisplay[i].slimeCamera(cameraStatus);
                    staticSlimeDisplay[i].slimeCamera(cameraStatus);
                }
                slimeDisplay[i].animate();
                staticSlimeDisplay[i].animate();
                
            }
            SystemState.repairSystem.toMove = false;
        } else {
            for (var i=0;i < roomList.length;i++) {
                roomList[i].updatePower(0);
            }
        }

    }

    init() {
        this.events.on('wake', function() {
            if (SystemState.repairSystem) {
                console.log(`Camera 1 Power: ${SystemState.repairSystem.camera1.getPower()} (${SystemState.repairSystem.camera1.getPowerPercentage() * 100}%)`);
                console.log(`Camera 2 Power: ${SystemState.repairSystem.camera2.getPower()} (${SystemState.repairSystem.camera2.getPowerPercentage() * 100}%)`);
                console.log(`Camera 3 Power: ${SystemState.repairSystem.camera3.getPower()} (${SystemState.repairSystem.camera3.getPowerPercentage() * 100}%)`);
                console.log(`Camera 4 Power: ${SystemState.repairSystem.camera4.getPower()} (${SystemState.repairSystem.camera4.getPowerPercentage() * 100}%)`);
            }
        }, this);
        
    }
}

function visualSlimeArray(slimeData,scene) {
    var visArray = []
    for (var i=0;i<slimeData.length;i++) {
        visArray.push(new SlimeVisual(slimeData[i],scene));
    }
    return visArray;
}

function visualStaticSlimeArray(slimeData,scene) {
    var visArray = []
    for (var i=0;i<slimeData.length;i++) {
        visArray.push(new StaticSlimeVisual(slimeData[i],scene));
    }
    return visArray;
}

export default CameraScene;