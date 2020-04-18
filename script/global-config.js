const screenWidth = 800;
const screenHeight = 600;

const playerVelocity = 160;

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
    {   tnl: 100,
        maxHunger: 10000,
        hungerRate: 10,
        tantrumThreshold: 5000,
    },
    {   tnl: 500,
        maxHunger: 10000,
        hungerRate: 20,
        tantrumThreshold: 2500,
    }
];

const farmLevels = [
    {

    }
];

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
    vatLevels,
    godLevels,
    farmLevels,
    inventoryLevels,
    minionLevels,
};

export {
    screenWidth,
    screenHeight,
    playerVelocity,
    vatLevels,
    godLevels,
    farmLevels,
    inventoryLevels,
    minionLevels,
};