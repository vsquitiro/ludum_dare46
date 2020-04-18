/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';

const page1Text = `
    At Approximately 8:32 AM, the facility
experienced a building wide system failure.
Generator back up restored basic functions a
few seconds afterwards. Security Personal
conducted investigation of the premises. The
Server room showed signs of sabotage both to
the hardware and systems. Loss of the security
system shows unable to restore data concerning
which personnel had accessed the Server room. No
monetary losses have occurred as the generator
restored the secondary Emergency Vault lock
before it was accessed. 
    A report has been filed with the Florpon
Police Department, interviews are being
conducted with the police and private inquiries
from the Head of Security Officer Gnob Debop.
Gnob Debop has instated the Senior Systems
Administrator to restore security systems.
`;

const page2Text = `
    Whoever is trying to get to good stuff in
the vault really messed up our system. If I
didn’t know any better you would have thought
a tornado of knives ran through the place. The
big man Toof thinks it was an agent trying to
get a hold of those new Dog Combat Boots
schematics, but I think it’s just for the pure
$Floots. Unfortunately we have to work from
square one but I know you’re perfect for the job.
I reset the administration login, please use it
to get started. Maybe you’ll find something that
you can pass onto the Police to aid their
investigation. I’ll send you a fax if I hear
anything else.
    Excuse me while I drown myself in coffee to
keep myself awake during these interviews.



USER : phaboodus
PASSWORD : strongdoor004


Gnob Debop
`

class FrameScene extends Phaser.Scene {
    folderOpen = false;

    create() {
        this.lightClick = this.sound.add('lightClick');
        this.mainMusicLoop = this.sound.add('mainLoop', {loop: true});

        this.frameMap = this.make.tilemap({key: "systemTilemap"});
        const tileset = this.frameMap.addTilesetImage('System', 'sysTile');
        this.frameLayer = this.frameMap.createStaticLayer('Frame', tileset, 0, -4);
        this.folderLayer = this.frameMap.createStaticLayer('Folder', tileset, 32 * 10, 0);
        this.openPage1Layer = this.frameMap.createStaticLayer('OpenFolder1', tileset, 0, 0);
        this.openPage2Layer = this.frameMap.createStaticLayer('OpenFolder2', tileset, 0, 0);

        this.page1TextDisplay = this.add.text(9.5 * 32, 4.7 * 32, page1Text, {color: "black", fontSize: "12px"});
        this.page1TextDisplay.setOrigin(0, 0).setVisible(false);
        this.page2TextDisplay = this.add.text(9.5 * 32, 4.7 * 32, page2Text, {color: "black", fontSize: "12px"});
        this.page2TextDisplay.setOrigin(0, 0).setVisible(false);

        this.openFolderZone = this.add.zone(23 * 32, 13 * 32, 2 * 32, 5 * 32).setOrigin(0).setName('openFolder');
        this.closeFolderZone = this.add.zone(6 * 32, 13 * 32, 2 * 32, 5 * 32).setOrigin(0).setName('closeFolder');
        this.nextPageZone = this.add.zone(20 * 32, 15 * 32, 2 * 32, 2 * 32).setOrigin(0).setName('nextPage');
        this.prevPageZone = this.add.zone(8 * 32, 15 * 32, 2 * 32, 2 * 32).setOrigin(0).setName('prevPage');
        
        this.frameLayer.setVisible(false);
        this.folderLayer.setVisible(false);
        this.openPage1Layer.setVisible(false);
        this.openPage2Layer.setVisible(false);

        this.input.on('gameobjectdown', function(pointer, gameObject) {
            if (gameObject.name == "openFolder") {
                this.folderLayer.setVisible(false);
                this.openPage1Layer.setVisible(true);
                this.page1TextDisplay.setVisible(true);
                
                this.openFolderZone.disableInteractive();
                this.nextPageZone.setInteractive({cursor: 'pointer'});
                this.closeFolderZone.setInteractive({cursor: 'pointer'});
            } else if (gameObject.name == "closeFolder") {
                this.folderLayer.setVisible(true);
                this.openPage1Layer.setVisible(false);
                this.openPage2Layer.setVisible(false);
                this.page1TextDisplay.setVisible(false);
                this.page2TextDisplay.setVisible(false);
                
                this.openFolderZone.setInteractive({cursor: 'pointer'});
                this.nextPageZone.disableInteractive();
                this.prevPageZone.disableInteractive();
                this.closeFolderZone.disableInteractive();
            } else if (gameObject.name == "nextPage") {
                this.openPage1Layer.setVisible(false);
                this.page1TextDisplay.setVisible(false);
                this.openPage2Layer.setVisible(true);
                this.page2TextDisplay.setVisible(true);
                
                this.nextPageZone.disableInteractive();
                this.prevPageZone.setInteractive({cursor: 'pointer'});
            } else if (gameObject.name == "prevPage") {
                this.openPage1Layer.setVisible(true);
                this.page1TextDisplay.setVisible(true);
                this.openPage2Layer.setVisible(false);
                this.page2TextDisplay.setVisible(false);
                
                this.nextPageZone.setInteractive({cursor: 'pointer'});
                this.prevPageZone.disableInteractive();
            }
        }, this);
    }
    update(time, delta) {
        if (SystemState.timeLoginStart && !SystemState.lightsOn) {
            if (time - SystemState.timeLoginStart > globalConfig.lightOffTime) {
                SystemState.lightsOn = true;
                this.lightClick.play();
                this.lightClick.on('complete', function() {
                    this.mainMusicLoop.play();
                }, this);
                this.frameLayer.setVisible(true);
                this.folderLayer.setVisible(true);
                this.openFolderZone.setInteractive({cursor: 'pointer'});
            }
        }
    }
}

export default FrameScene;