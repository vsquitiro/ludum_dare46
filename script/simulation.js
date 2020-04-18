/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';

export class Simulation {
    updateSimulation(delta) {
        if (SystemState.runSimulation) {
            delta = delta/1000;
            this.updateVatLevel(delta);
            this.updateGod(delta);
        }
    }

    updateVatLevel(delta) {
        const vatState = SystemState.getCurrentVatState();
        const updatedUnits = vatState.currentUnits - (vatState.drainRate * delta);
        SystemState.vat.currentUnits = Math.max(0, updatedUnits);
    }

    updateGod(delta) {
        const godState = SystemState.getCurrentGotState();
        const updatedHunger = godState.hunger + (godState.hungerRate * delta);
        SystemState.god.hunger = Math.max(0, updatedHunger);
        if(updatedHunger>godState.tantrumThreshold) {
            SystemState.god.tantrum = true;
        }
        console.log("God Hunger: " + SystemState.god.hunger);
        console.log("Tantrum: " + SystemState.god.tantrum);
    }
}