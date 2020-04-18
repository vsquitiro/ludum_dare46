const screenWidth = 800;
const screenHeight = 600;

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
        upgradeCost: 5,
    },
    {
        produce: 8,
        upgradeCost: 15,
    },
    {
        produce: 20,
        upgradeCost: 45,
    },
    {
        produce: 45,
        upgradeCost: 135,
    },
    {
        produce: 100,
        upgradeCost: Infinity,
    }
];

const irrigationLevels = [
    {
        harvestAt: 50,
        upgradeCost: 10,
    },
    {
        harvestAt: 40,
        upgradeCost: 25,
    },
    {
        harvestAt: 30,
        upgradeCost: 50,
    },
    {
        harvestAt: 20,
        upgradeCost: Infinity,
    }
];

const capacityLevels = [
    {
        capacity: 5,
        upgradeCost: 25,
    },
    {
        capacity: 10,
        upgradeCost: 75,
    },
    {
        capacity: 25,
        upgradeCost: 250,
    },
    {
        capacity: 100,
        upgradeCost: Infinity,
    }
];

const rateLevels = [
    {
        rate: 15,
        upgradeCost: 15,
    },
    {
        rate: 10,
        upgradeCost: 40,
    },
    {
        rate: 5,
        upgradeCost: 100,
    },
    {
        rate: 1,
        upgradeCost: Infinity,
    }
];

const toolLevels = [
    {
        gatherReduction: 10,
        gatherYield: 1,
        upgradeCost: 50,
    },
    {
        gatherReduction: 5,
        gatherTield: 2,
        upgradeCost: 200,
    },
    {
        gatherReduction: 2,
        gatherYield: 3,
        upgradeCost: 1000,
    },
    {
        gatherReduction: 1,
        gatherYield: 5,
        upgradeCost: Infinity,
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
    vatLevels,
    godLevels,
    farmLevels,
    inventoryLevels,
    minionLevels,
};

export {
    screenWidth,
    screenHeight,
    vatLevels,
    godLevels,
    farmLevels,
    inventoryLevels,
    minionLevels,
};