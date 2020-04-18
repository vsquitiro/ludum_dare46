var config = {
    type: Phaser.AUTO,
    width: ,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('dummy', 'assets/Characterslimes.png' { frameWidth: 32, frameHeight:48 });
}

function create ()
{

}