const screenWidth = 800;
const screenHeight = 600;

const playerVelocity = 240;
const messageOpportunityTime = 5000;
const messageChance = 0.05;
const tantrumMessageChance = 0.2;
const fuelTimeout = 10*1000;
const crackTimeout = 20*1000;

const vatLevels = [
    {
        //change for final game
        maxUnits: 1000,
        drainRate: 0,
    },
    {
        maxUnits: 1000,
        drainRate: 9,
    },
    {
        maxUnits: 1500,
        drainRate: 13,
    },
    {
        maxUnits: 2000,
        drainRate: 22,
    }
];

const godLevels = [
    {   
        tnl: 1,
        maxHunger: 1000,
        hungerRate: 1,
        tantrumThreshold: 1000,
    },
    {   
        tnl: 50,
        maxHunger: 1000,
        hungerRate: 5,
        tantrumThreshold: 750,
    },
    {   
        tnl: 100,
        maxHunger: 1000,
        hungerRate: 10,
        tantrumThreshold: 500,
    },
    {   
        //TODO change back
        tnl: 200,
        maxHunger: 1000,
        hungerRate: 20,
        tantrumThreshold: 250,
    }
];

const farmLevels = [
    {
        produce: 5,
        farmUpgradeCost: 10,

        //return to irrigation when implemented
        harvestAt: 15,
    },
    {
        produce: 5,
        farmUpgradeCost: 30,

        //return to irrigation when implemented
        harvestAt: 25,  
    },
    {
        produce: 9,
        farmUpgradeCost: 90,
        
        //return to irrigation when implemented
        harvestAt: 20,
    },
    {
        produce: 15,
        farmUpgradeCost: 270,
        
        //return to irrigation when implemented
        harvestAt: 15,
    },
    {
        produce: 25,
        farmUpgradeCost: Infinity,

        //return to irrigation when implemented
        harvestAt: 10,
    }
];

// const irrigationLevels = [
//     {   
//         //Integrating into FarmLevel until building is implemented
//         harvestAt: 60,
//         irrigationUpgradeCost: 10,
//     },
//     {   
//         //Integrating into FarmLevel until building is implemented
//         harvestAt: 50,
//         irrigationUpgradeCost: 10,
//     },
//     {
//         harvestAt: 40,
//         irrigationUpgradeCost: 25,
//     },
//     {
//         harvestAt: 30,
//         irrigationUpgradeCost: 50,
//     },
//     {
//         harvestAt: 20,
//         irrigationUpgradeCost: Infinity,
//     }
// ];

// const capacityLevels = [
//     {
//         capacity: 5,
//         capacityUpgradeCost: 10,
//     },
//     {
//         capacity: 8,
//         capacityUpgradeCost: 30,
//     },
//     {
//         capacity: 12,
//         capacityUpgradeCost: 90,
//     },
//     {
//         capacity: 18,
//         capacityUpgradeCost: 270,
//     },
//     {
//         capacity: 30,
//         capacityUpgradeCost: Infinity,
//     },
// ];

const rateLevels = [
    {
        //integrating capacity levels until building is implemented
        rate: 8,
        rateUpgradeCost: 5,

        //return to capacity when implemented
        capacity: 5,
    },
    {
        rate: 6,
        rateUpgradeCost: 10,

        //return to capacity when implemented
        capacity: 8,
    },
    {
        rate: 3,
        rateUpgradeCost: 20,

        //return to capacity when implemented
        capacity: 12,  
    },
    {
        rate: 1,
        rateUpgradeCost: 40,

        //return to capacity when implemented
        capacity: 18,
    },
        {
        rate: 0.5,
        rateUpgradeCost: Infinity,

        //return to capacity when implemented
        capacity: 30,
    },
];

const toolLevels = [
    {
        gatherReduction: 10,
        gatherYield: 1,
        toolUpgradeCost: 50,
    },
    {
        gatherReduction: 5,
        gatherTield: 2,
        toolUpgradeCost: 200,
    },
    {
        gatherReduction: 2,
        gatherYield: 3,
        toolUpgradeCost: 1000,
    },
    {
        gatherReduction: 1,
        gatherYield: 5,
        toolUpgradeCost: Infinity,
    }
]


const inventoryLevels = [
    {

    }
];

const minionLevels = [
    {

    }
];

export default {
    screenWidth,
    screenHeight,
    playerVelocity,
    fuelTimeout,
    crackTimeout,
    messageOpportunityTime,
    messageChance,
    tantrumMessageChance,
    vatLevels,
    godLevels,
    farmLevels,
    // irrigationLevels,
    // capacityLevels,
    rateLevels,
    toolLevels,
    inventoryLevels,
    minionLevels,
};

export {
    screenWidth,
    screenHeight,
    playerVelocity,
    fuelTimeout,
    crackTimeout,
    messageOpportunityTime,
    messageChance,
    tantrumMessageChance,
    vatLevels,
    godLevels,
    farmLevels,
    // irrigationLevels,
    // capacityLevels,
    rateLevels,
    toolLevels,
    inventoryLevels,
    minionLevels,
};