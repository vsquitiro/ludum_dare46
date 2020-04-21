import SystemState from './state-machine.js';
import globalConfig from './global-config.js';

export const scripts = [
    {
        name: 'startScript',
        conditions: [],
        script: [
            {
                message: "WHAT ARE YOU DOING IN HERE?\nWHY HAVE YOU DISTURBED MY\nINNER SANCTUM??",
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
        name: 'badFeed',
        conditions: ['startScript', 'firstFeed', '!firstPlant'],
        script: [
            {
                preMessage: () => {
                    SystemState.allowInteraction = false;
                    SystemState.allowMovement = false;
                },
                message: "ONE WILL NOT BE ENOUGH\nIMBECILE! YOU MUST GROW MORE!\nHere is my last one. PLANT IT!",
                onComplete: () => {
                    SystemState.inventory.food = 1;
                    SystemState.allowInteraction = true;
                    SystemState.allowMovement = true;

                    //Hack to make crack work
                    SystemState.feedings = 0;
                    SystemState.eventsComplete = SystemState.eventsComplete.filter((item) => item !== 'firstFeed');
                    
                    return "complete";
                },
            },
        ],
    },
    {
        name: 'onFirstPlant',
        conditions: ['startScript', 'firstPlant'],
        script: [
            {
                message: 'I cannot believe your\nincompetence.',
                onComplete: 'next',
            },
            {
                message: 'When I get out of this vat\nyou will be punished',
                onComplete: 'next',
            },
            {
                message: 'And if you do not help me\nI will use the last of my\nstrength to end you',
                onComplete: 'next',
            },
            {
                message: 'And it will hurt the whole time',
                onComplete: 'next',
            },
            {
                preMessage: () => {
                    const thePlot = SystemState.farm.find((plot) => plot.planted);
                    thePlot.growing = false;
                    thePlot.harvestable = true;
                    thePlot.currentUnits = 5;
                },
                message: 'Good, it looks like the Embroja\nhas matured. Harvest it\nand feed your God',
                onComplete: () => {
                    SystemState.runSimulation = true;
                    return "complete";
                },
            },
        ],
    },
    {
        name: 'firstGoodFeed',
        conditions: ['startScript', 'onFirstPlant', 'firstFeed'],
        script: [
            {
                message: "I feel my strength returning\nalready. But don't rest yet.",
                onComplete: 'next',
            },
            {
                message: "I need more, MUCH MORE",
                onComplete: () => {
                    setTimeout(() => SystemState.eventsComplete.push('impatient'), globalConfig.fuelTimeout);
                    return "complete";
                },
            },
        ],
    },
    {
        name: 'fuelGiven',
        conditions: ['startScript', 'firstGoodFeed', 'impatient'],
        script: [
            {
                message: "This is taking too long!\nI'll sacrifice some of my\nNektare so you can make\nfertilizer",
                onComplete: 'next',
            },
            {
                message: "Prime these Nektare fountains\nto produce more",
                onComplete: () => {
                    SystemState.enableSprings = true;
                    SystemState.inventory.fuel = 1;
                    setTimeout(() => SystemState.eventsComplete.push('restless'), globalConfig.crackTimeout);
                    return "complete";
                },
            },
        ],
    },
    {
        name: 'glassCracked',
        conditions: ['startScript', 'fuelGiven', 'restless'],
        script: [
            {
                preMessage: (scene) => {
                    scene.cameras.main.shake(250);
                },
                message: "*struggles*",
                onComplete: 'next',
            },
            {
                message: "I can do nothing in this minimal\nform!",
                onComplete: 'next',
            },
            {
                preMessage: (scene) => {
                    scene.cameras.main.shake(250);
                },
                message: "*struggles*",
                onComplete: 'next',
            },
            {
                preMessage: (scene) => {
                    scene.crackAudio.play();
                },
                message: '*CRACK*',
                onComplete: (scene) => {
                    SystemState.showBar = true;
                    SystemState.vat.draining = true;
                    SystemState.enableFilling = true;
                    return 'next';
                },
            },
            {
                message: 'GAH! And now I’ve cracked my vat!',
                onComplete: 'next',
            },
            {
                message: 'My Nektare is draining!\nIf it gets too low I will die',
                onComplete: 'next',
            },
            {
                message: 'Harvest more Nektare and refill\nmy vat.',
                onComplete: "next",
            },
            {
                message: 'There is a port on the springs\nthat accepts Nektare and improves\ntheir performance',
                onComplete: 'next'
            },
            {
                message: 'But you would know that if you\nwere any good at your job',
                onComplete: () => {
                    SystemState.enableChaos = true;
                    return 'complete';
                },
            },
        ],
    },
    {
        name: 'upgrade1',
        conditions: ['startScript', 'secondForm'],
        script: [
            {
                message: "STRONGER! I feel STRONGER! MORE!",
                onComplete: 'next',
            },
            {
                preMessage: (scene) => {
                    scene.crackAudio.play();
                },
                message: "*CRACK* *SPLASH*",
                onComplete: "complete"
            },
        ],
    },
    {
        name: 'upgrade2',
        conditions: ['startScript', 'thirdForm'],
        script: [
            {
                message: "I can feel my strength returning! Yes!",
                onComplete: 'next',
            },
            {
                preMessage: (scene) => {
                    scene.crackAudio.play();
                },
                message: "*CRACK* *SPLASH*",
                onComplete: "next"
            },
            {
                message: "Argh! Even more ??? is spilling.\nQuit standing around you fool.",
                onComplete: 'complete',
            },
        ],
    },
];
