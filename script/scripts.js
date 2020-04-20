import SystemState from './state-machine.js';

export const scripts = [
    {
        name: 'startScript',
        conditions: [],
        script: [
            {
                message: "WHAT ARE YOU DOING IN HERE? WHY\nHAVE YOU DISTURBED MY INNER\nSANCTUM??",
                onComplete: "next",
            },
            {
                message: "Whe… where are my servants?\nWhere are my followers?",
                onComplete: "next",
            },
            {
                message: "You! You’re the brain-dead fool\nwho tidies this place. What\nhave you done??",
                onComplete: "next",
            },
            {
                message: "You’ve spilled my potions and\nshrunk me to a larva you\nimbecile!",
                onComplete: "next",
            },
            {
                message: "And you seem to have vanished\nmy followers, too, in one\nidiotic action.",
                onComplete: "next",
            },
            {
                message: "You! Come here!",
                onComplete: "next",
            },
            {
                message: "You fix this or I devour you,\nfeet first!",
                onComplete: "next",
            },
            {
                message: "You must find me enough\nsustenance to grow me back\nto my true form",
                onComplete: "next",
            },
            {
                message: "Take this Embroja and be off.\nQUICKLY YOU CLOD!",
                onComplete: () => {
                    SystemState.allowMovement = true;
                    SystemState.allowInteraction = true;
                    SystemState.inventory.food = 1;
                    return 'complete';
                },
            },
        ],
    },
    {
        name: 'onFirstFeed',
        conditions: ['startScript', '!onFirstPlant'],
        script: [
            {
                preMessage: () => {
                    SystemState.allowInteraction = false;
                    SystemState.allowMovement = false;
                },
                message: "ONE WILL NOT BE ENOUGH IMBECILE!\nYOU MUST PLANT IT! Here's\nmy last one. PLANT IT!",
                onComplete: () => {
                    SystemState.inventory.food = 1;
                    SystemState.allowInteraction = true;
                    SystemState.allowMovement = true;
                    return "complete";
                },
            },
        ],
    },
    {
        name: 'onFirstPlant',
        conditions: ['startScript'],
        script: [
            {
                message: 'SOME MORE TEXT',
                onComplete: 'complete',
            },
        ],
    },
];
