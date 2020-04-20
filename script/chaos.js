/** @type {import("../typings/phaser")} */

import { messageChance, tantrumMessageChance, messageOpportunityTime } from './global-config.js';
import SystemState from './state-machine.js';

const hungerMessages = [
    "I'm hungry!",
    "I'm still hungry!",
    "Feed me now!",
];

const vatMessages = [
    "The fluid is getting low!",
    "Asshole! Fluids!",
    "Need more liquid in here",
];

export class Chaos {
    checkForMessage(time) {
        if (SystemState.isPaused || !SystemState.enableChaos || SystemState.currentEvent) return;
        
        if (time - SystemState.lastMessageCheckTime > messageOpportunityTime) {
            SystemState.lastMessageCheckTime = time;

            const godState = SystemState.getCurrentGodState();
            const vatState = SystemState.getCurrentVatState();

            let vatMessageChance = 0.25;

            if (vatState.percentage < .25) {
                vatMessageChance = .75;
            }

            if(SystemState.god.level == 0) {
                vatMessageChance = 0;
            }

            const chance = godState.inTantrum ? tantrumMessageChance : messageChance;
            const sendMessageTest = Math.random();

            if (sendMessageTest < chance) {
                const messageTypeTest = Math.random();

                if (messageTypeTest < vatMessageChance) {
                    SystemState.displayMessage(this.getVatMessage(vatState.percentage));
                } else {
                    SystemState.displayMessage(this.getHungerMessage(godState.inTantrum));
                }
            }
        }
    }

    getVatMessage(percentage) {
        // Check percentage, get from different list
        const list = percentage < .25 ? vatMessages : vatMessages;

        const idx = Math.floor(Math.random() * list.length);

        return list[idx];
    }

    getHungerMessage(tantrum) {
        // Check tantrum, get from different list
        const list = tantrum ? hungerMessages : hungerMessages;

        const idx = Math.floor(Math.random() * list.length);

        return list[idx];
    }
}