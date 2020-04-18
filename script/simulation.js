/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';

export class Simulation {
    updateSimulation(delta) {
        if (SystemState.runSimulation) {
            delta = delta/1000;
            this.updateVatLevel(delta);
            this.updateGod(delta);
            this.updateFarm(delta);
        }
    }

    updateVatLevel(delta) {
        const vatState = SystemState.getCurrentVatState();
        const updatedUnits = vatState.currentUnits - (vatState.drainRate * delta);
        SystemState.vat.currentUnits = Math.max(0, updatedUnits);
    }

    updateGod(delta) {
        const godState = SystemState.getCurrentGodState();
        const updatedHunger = godState.hunger + (godState.hungerRate * delta);
        SystemState.god.hunger = Math.max(0, updatedHunger);
        
        if(!SystemState.god.tantrum && updatedHunger>=godState.tantrumThreshold) {
            console.log("Setting Tantrum to true");
            SystemState.god.tantrum = true;
        } else if(SystemState.god.tantrum && updatedHunger<godState.tantrumThreshold) {
            console.log("Setting Tantrum to false");
            SystemState.god.tantrum = false;
        }
        if(updatedHunger>godState.maxHunger) {
            console.log("Setting lose to true");
            SystemState.winState.lose = true;
        }
        if(SystemState.god.exp > godState.tnl) {
            console.log("God Level Up");
            SystemState.god.exp = 0;
            if(SystemState.god.level < 3) {
                SystemState.god.level++;
            } else {
                console.log("The game is won!")
                SystemState.winState.win = true;
            }
        }

        console.log("God Hunger: " + SystemState.god.hunger);
        console.log("Tantrum: " + SystemState.god.tantrum);
        console.log("winState: win: " + SystemState.winState.win);
        console.log("winState lose: " + SystemState.winState.lose);
        console.log("God Level: " + SystemState.god.level);
    }

    updateFarm(delta) {
        const farmState = SystemState.getCurrentFarmState();
        farmState.plots.forEach((value,idx)=>{
            if (value.planted) {
                if (value.fert) {
                    SystemState.farm.plots[idx].progress += delta*2;
                    SystemState.farm.plots[idx].fertTimeRemain -= delta;
                 } else {   
                    SystemState.farm.plots[idx].progress += delta;
                }
                if(SystemState.farm.plots[idx].progress > value.harvestAt) {
                    SystemState.farm.plots[idx].harvest = true;
                    SystemState.farm.plots[idx].currentUnits += value.produce;
                    SystemState.farm.plots[idx].planted = false;
                    SystemState.farm.plots[idx].progress = 0;
                }
            }
        })
        console.log("Planted: " + SystemState.farm.plots[0].planted);
        console.log("Progress: " + SystemState.farm.plots[0].progress);
        console.log("Harvest: " + SystemState.farm.plots[0].harvest);
        console.log("CurrentUnits: " + SystemState.farm.plots[0].currentUnits);
    }
}