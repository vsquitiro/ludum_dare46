/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';

const tabList = [
    {
        name: "Cameras",
        state: "camera",
        transition: "viewCameras"
    },
    {
        name: "Database",
        state: "directory",
        transition: "viewDirectory"
    },
    {
        name: "System",
        state: "system",
        transition: "viewSystem"
    },
    // {
    //     name: "Comms",
    //     state: "comms",
    //     transition: "viewComms"
    // }
]

class TabStrip {
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {string} active 
     */
    constructor(scene, activeTab) {
        this.scene = scene;
        this.activeTab = activeTab;

        this.tabs = tabList.map((tab, index) => {
            return new Tab(
                this.scene,
                tab,
                tab.name == activeTab,
                4 + (4 * index),
                3.5
            );
        });

        
    }
}

class Tab {
    static activeFrame = 0;
    static inactiveFrame = 18;
    static clickedFrame = 9;
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {any} tabConfig 
     * @param {boolean} active
     * @param {integer} xCell
     * @param {integer} yCell
     */
    constructor(scene, tabConfig, active, xCell, yCell) {
        this.scene = scene;
        this.tabConfig = tabConfig;

        this.active = active;
        this.xCell = xCell;
        this.yCell = yCell;

        this.spriteList = [];

        for (let i = 0; i < 4; i++) {
            let sprite = this.scene.add.sprite(
                (xCell + i) * 32,
                yCell * 32,
                'border',
                (this.active ? Tab.activeFrame : Tab.inactiveFrame) + (i > 1 ? i - 1 : i)
            );
            sprite.setOrigin(0, 0);
            if (!this.active) {
                sprite.setInteractive({ cursor: 'pointer' });
                sprite.on('pointerdown', function() {
                    this.onclick();
                }, this);
            }
            this.spriteList.push(sprite);
        }

        this.tabText = this.scene.add.text(
            this.xCell * 32 + 2 * 32,
            yCell * 32 + 16,
            this.tabConfig.name
        );
        this.tabText.setColor(this.active ? 'black' : 'white');
        this.tabText.setOrigin(0.5, 0.5);
    }

    onclick() {
        if (!this.active) {
            SystemState[this.tabConfig.transition]();
        }
    }
}

export {
    tabList
}

export default TabStrip;