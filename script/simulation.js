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
            this.updateFountain(delta);
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

        // console.log("God Hunger: " + SystemState.god.hunger);
        // console.log("Tantrum: " + SystemState.god.tantrum);
        // console.log("winState: win: " + SystemState.winState.win);
        // console.log("winState lose: " + SystemState.winState.lose);
        // console.log("God Level: " + SystemState.god.level);
    }

    updateFarm(delta) {
        const farmState = SystemState.getCurrentFarmState();
        farmState.forEach((value,idx)=>{
            if (value.growing) {
                if (value.fert) {
                    SystemState.farm[idx].progress += delta*2;
                    SystemState.farm[idx].fertTimeRemain -= delta;
                    if (SystemState.farm[idx].fertTimeRemain <= 0) {
                        SystemState.farm[idx].fertTimeRemain = 0;
                        SystemState.farm[idx].fert = false;
                    }
                 } else {   
                    SystemState.farm[idx].progress += delta;
                }
                if(SystemState.farm[idx].progress > value.harvestAt) {
                    SystemState.farm[idx].harvestable = true;
                    SystemState.farm[idx].currentUnits += value.produce;
                    SystemState.farm[idx].growing = false;
                    SystemState.farm[idx].progress = 0;
                }
            }

            if(value.farmExp>value.farmUpgradeCost) {
                SystemState.farm[idx].farmLevel++;
                SystemState.farm[idx].exp = 0;
            }
        })

        // console.log("Farm Planted: " + SystemState.farm[0].planted);
        // console.log("Farm Progress: " + SystemState.farm[0].progress);
        // console.log("Farm Growing: " + SystemState.farm[0].growing); 
        // console.log("Farm Harvest: " + SystemState.farm[0].harvestable);
        // console.log("Farm CurrentUnits: " + SystemState.farm[0].currentUnits);
    }

    updateFountain(delta) {
        const fountainState = SystemState.getCurrentFountainState();
        fountainState.forEach((value,idx)=>{
            if (value.planted && SystemState.fountain[idx].currentUnits < value.capacity) {
                SystemState.fountain[idx].progress += delta;
                if(SystemState.fountain[idx].progress >= value.rate) {
                    SystemState.fountain[idx].progress -= value.rate;
                    SystemState.fountain[idx].currentUnits++;
                }
            }

            if(value.rateExp>value.rateUpgradeCost) {
                SystemState.fountain[idx].rateLevel++;
                SystemState.fountain[idx].exp = 0;
            }
        })

        // console.log("Fountain Planted: " + SystemState.fountain[0].planted);
        // console.log("Fountain Progress: " + SystemState.fountain[0].progress);
        // console.log("Fountain CurrentUnits: " + SystemState.fountain[0].currentUnits);
    }
}