const screenWidth = 800;
const screenHeight = 600;

const playerVelocity = 240;
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
    {   
        tnl: 1,
        maxHunger: 1000,
        hungerRate: 1,
        //TODO switch back
        // hungerRate: 1,
        tantrumThreshold: 1000
    },
    {   
        //TODO change back
        tnl: 1,
        //tnl: 30,
        maxHunger: 1000,
        hungerRate: 5,
        tantrumThreshold: 750,
    },
    {   
        //TODO change back
        tnl: 1,
        //tnl: 300,
        maxHunger: 1000,
        hungerRate: 10,
        tantrumThreshold: 500,
    },
    {   
        //TODO change back
        tnl: 1,
        // tnl: 3000,
        maxHunger: 1000,
        hungerRate: 20,
        tantrumThreshold: 250,
    }
];

const farmLevels = [
    {
        produce: 3,
        //TODO change back
        farmUpgradeCost: 1,
        // farmUpgradeCost: 5,
    },
    {
        produce: 8,
        farmUpgradeCost: 1,
        // farmUpgradeCost: 15,
    },
    {
        produce: 20,
        farmUpgradeCost: 1,
        // farmUpgradeCost: 45,
    },
    {
        produce: 45,
        farmUpgradeCost: 1,
        // farmUpgradeCost: 135,
    },
    {
        produce: 100,
        farmUpgradeCost: Infinity,
    }
];

const irrigationLevels = [
    {   
        //TODO set back to real value
        harvestAt: 1, //debugging
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
        //TODO revert
        rate: 1,
        // rate: 15,
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