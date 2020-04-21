/** @type {import("../typings/phaser")} */

import { messageChance, tantrumMessageChance, messageOpportunityTime } from './global-config.js';
import SystemState from './state-machine.js';

const hungerMessages = [
    "Quit your loafing and feed me.",
    "If your species treats your\noffspring like this, how have\nyou survived?\nI need food now!",
    "If you fail to feed me soon,\nthe next pathetic being I\nsee will be my meal.",
];

const level2Hunger = [
    "I, SERPENS, MUST EAT!!!!!",
    "Did I misunderstand your language\ncapabilities??? What part of\n“FEED ME” escapes your grasp??",
    "That growl you hear is my\nstomach. The next one you hear\nwill signal your death.",
]

const vatMessages = [
    "Let me spell this out for you:\nthe Nektare is draining fast.",
    "Remember, you pitiful wretch,\nI need more Nektare\nto survive.",
    "Drip, drip, drip…\nthis torture you’ve inflicted…\ndrip, drip, drip…",
];

const level2Vat = [
    "How many times must I tell you:\nthe Nektare does not replenish\nitself!",
    "My last act will not be to flounder\nhere as I suffocate without\nNektare. My last action will be\nto snuff your pathetic life.",
    "You have seen but a fraction\nof my irritation, you feeble worm.",
]

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

            if(!SystemState.vat.draining) {
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
        const list = percentage < .25 ? level2Vat : vatMessages;

        const idx = Math.floor(Math.random() * list.length);

        return list[idx];
    }

    getHungerMessage(tantrum) {
        // Check tantrum, get from different list
        const list = tantrum ? level2Hunger : hungerMessages;

        const idx = Math.floor(Math.random() * list.length);

        return list[idx];
    }
}