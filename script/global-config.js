const screenWidth = 800;
const screenHeight = 600;

const playerVelocity = 160;
const messageOpportunityTime = 5000;
const messageChance = 0.05;
const tantrumMessageChance = 0.2;

const vatLevels = [
    {
        //change for final game
        maxUnits: 1000,
        drainRate: 0,
    },
    {
        maxUnits: 1000,
        drainRate: 5,
    },
    {
        maxUnits: 1500,
        drainRate: 10,
    },
    {
        maxUnits: 2000,
        drainRate: 30
    }
];

const godLevels = [
    {   //change for final game
        tnl: 30,
        maxHunger: 10000,
        hungerRate: 1,
        tantrumThreshold: 10000
    },
    {   tnl: 30,
        maxHunger: 10000,
        hungerRate: 5,
        tantrumThreshold: 7500,
    },
    {   tnl: 300,
        maxHunger: 10000,
        hungerRate: 10,
        tantrumThreshold: 5000,
    },
    {   tnl: 3000,
        maxHunger: 10000,
        hungerRate: 20,
        tantrumThreshold: 2500,
    }
];

const farmLevels = [
    {
        produce: 3,
        farmUpgradeCost: 5,
    },
    {
        produce: 8,
        farmUpgradeCost: 15,
    },
    {
        produce: 20,
        farmUpgradeCost: 45,
    },
    {
        produce: 45,
        farmUpgradeCost: 135,
    },
    {
        produce: 100,
        farmUpgradeCost: Infinity,
    }
];

const irrigationLevels = [
    {
        harvestAt: 10, //debugging
        //harvestAt: 50,
        irrigationUpgradeCost: 10,
    },
    {
        harvestAt: 40,
        irrigationUpgradeCost: 25,
    },
    {
        harvestAt: 30,
        irrigationUpgradeCost: 50,
    },
    {
        harvestAt: 20,
        irrigationUpgradeCost: Infinity,
    }
];

const capacityLevels = [
    {
        capacity: 5,
        capacityUpgradeCost: 25,
    },
    {
        capacity: 10,
        capacityUpgradeCost: 75,
    },
    {
        capacity: 25,
        capacityUpgradeCost: 250,
    },
    {
        capacity: 100,
        capacityUpgradeCost: Infinity,
    }
];

const rateLevels = [
    {
        rate: 15,
        rateUpgradeCost: 15,
    },
    {
        rate: 10,
        rateUpgradeCost: 40,
    },
    {
        rate: 5,
        rateUpgradeCost: 100,
    },
    {
        rate: 1,
        rateUpgradeCost: Infinity,
    }
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
    messageOpportunityTime,
    messageChance,
    tantrumMessageChance,
    vatLevels,
    godLevels,
    farmLevels,
    irrigationLevels,
    capacityLevels,
    rateLevels,
    toolLevels,
    inventoryLevels,
    minionLevels,
};

export {
    screenWidth,
    screenHeight,
    playerVelocity,
    messageOpportunityTime,
    messageChance,
    tantrumMessageChance,
    vatLevels,
    godLevels,
    farmLevels,
    irrigationLevels,
    capacityLevels,
    rateLevels,
    toolLevels,
    inventoryLevels,
    minionLevels,
};