import Phaser from 'phaser';
import MainScene from '../scenes/main-scene';
import SystemState from './state-machine';
import globalConfig from './global-config';

export enum OnComplete {
    NEXT = 'next',
    COMPLETE = 'complete'
};

export type OnCompleteFunction = (scene:Phaser.Scene) => OnComplete;
export type PreMessageFunction = (scene:Phaser.Scene) => void;

export interface ScriptStep {
    message?: string;
    onComplete: OnComplete | OnCompleteFunction;
    preMessage?: PreMessageFunction;
}
export interface Script {
    name: string;
    conditions: string[];
    script: ScriptStep[];
    onStep?: number;
}

export const scripts: Script[] = [
    {
        name: 'startScript',
        conditions: [],
        script: [
            {
                message: "WHAT ARE YOU DOING IN HERE?\nWHY HAVE YOU DISTURBED MY\nINNER SANCTUM??",
                onComplete: OnComplete.NEXT,
            },
            {
                message: "Whe… where are my servants?\nWhere are my followers?",
                onComplete: OnComplete.NEXT,
            },
            {
                message: "You! You’re the brain-dead fool\nwho tidies this place. What\nhave you done??",
                onComplete: OnComplete.NEXT,
            },
            {
                message: "You’ve spilled my potions and\nshrunk me to a larva you\nimbecile!",
                onComplete: OnComplete.NEXT,
            },
            {
                message: "And you seem to have vanished\nmy followers, too, in one\nidiotic action.",
                onComplete: OnComplete.NEXT,
            },
            {
                message: "You! Come here!",
                onComplete: OnComplete.NEXT,
            },
            {
                message: "You fix this or I devour you,\nfeet first!",
                onComplete: OnComplete.NEXT,
            },
            {
                message: "You must find me enough\nsustenance to grow me back\nto my true form",
                onComplete: OnComplete.NEXT,
            },
            {
                message: "Take this Embroja and be off.\nQUICKLY YOU CLOD!",
                onComplete: () => {
                    SystemState.allowMovement = true;
                    SystemState.allowInteraction = true;
                    SystemState.inventory.food = 1;
                    return OnComplete.COMPLETE;
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
                    SystemState.eventsComplete = SystemState.eventsComplete.filter((item:string) => item !== 'firstFeed');
                    
                    return OnComplete.COMPLETE;
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
                onComplete: OnComplete.NEXT,
            },
            {
                message: 'When I get out of this vat\nyou will be punished',
                onComplete: OnComplete.NEXT,
            },
            {
                message: 'And if you do not help me\nI will use the last of my\nstrength to end you',
                onComplete: OnComplete.NEXT,
            },
            {
                message: 'And it will hurt the whole time',
                onComplete: OnComplete.NEXT,
            },
            {
                preMessage: () => {
                    const thePlot = SystemState.farm.find((plot:any) => plot.planted);
                    thePlot.growing = false;
                    thePlot.harvestable = true;
                    thePlot.currentUnits = 5;
                },
                message: 'Good, it looks like the Embroja\nhas matured. Harvest it\nand feed your God',
                onComplete: () => {
                    SystemState.runSimulation = true;
                    return OnComplete.COMPLETE;
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
                onComplete: OnComplete.NEXT,
            },
            {
                message: "I need more, MUCH MORE",
                onComplete: () => {
                    setTimeout(() => SystemState.eventsComplete.push('impatient'), globalConfig.fuelTimeout);
                    return OnComplete.COMPLETE;
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
                onComplete: OnComplete.NEXT,
            },
            {
                message: "Prime these Nektare fountains\nto produce more",
                onComplete: () => {
                    SystemState.enableSprings = true;
                    SystemState.inventory.fuel = 1;
                    setTimeout(() => SystemState.eventsComplete.push('restless'), globalConfig.crackTimeout);
                    return OnComplete.COMPLETE;
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
                onComplete: OnComplete.NEXT,
            },
            {
                message: "I can do nothing in this minimal\nform!",
                onComplete: OnComplete.NEXT,
            },
            {
                preMessage: (scene) => {
                    scene.cameras.main.shake(250);
                },
                message: "*struggles*",
                onComplete: OnComplete.NEXT,
            },
            {
                preMessage: (scene:MainScene) => {
                    scene.crackAudio.play();
                },
                message: '*CRACK*',
                onComplete: () => {
                    SystemState.showBar = true;
                    SystemState.vat.draining = true;
                    SystemState.enableFilling = true;
                    return OnComplete.NEXT;
                },
            },
            {
                message: 'GAH! And now I’ve cracked my vat!',
                onComplete: OnComplete.NEXT,
            },
            {
                message: 'My Nektare is draining!\nIf it gets too low I will die',
                onComplete: OnComplete.NEXT,
            },
            {
                message: 'Harvest more Nektare and refill\nmy vat.',
                onComplete: OnComplete.NEXT,
            },
            {
                message: 'There is a port on the springs\nthat accepts Nektare and improves\ntheir performance',
                onComplete: OnComplete.NEXT
            },
            {
                message: 'But you would know that if you\nwere any good at your job',
                onComplete: () => {
                    SystemState.enableChaos = true;
                    return OnComplete.COMPLETE;
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
                onComplete: OnComplete.NEXT,
            },
            {
                preMessage: (scene:MainScene) => {
                    scene.crackAudio.play();
                },
                message: "*CRACK* *SPLASH*",
                onComplete: OnComplete.COMPLETE
            },
        ],
    },
    {
        name: 'upgrade2',
        conditions: ['startScript', 'thirdForm'],
        script: [
            {
                message: "I can feel my strength returning! Yes!",
                onComplete: OnComplete.NEXT,
            },
            {
                preMessage: (scene:MainScene) => {
                    scene.crackAudio.play();
                },
                message: "*CRACK* *SPLASH*",
                onComplete: OnComplete.NEXT
            },
            {
                message: "Argh! Even more ??? is spilling.\nQuit standing around you fool.",
                onComplete: OnComplete.COMPLETE,
            },
        ],
    },
];
