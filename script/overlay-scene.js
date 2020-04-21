/** @type {import("../typings/phaser")} */

import { screenWidth, screenHeight, vatLevels, godLevels } from './global-config.js';
import SystemState from './state-machine.js';

const border = 20;
const center = screenWidth*1/50;
const width = (screenWidth*1/4) - border;
const height = 40;

class OverlayScene extends Phaser.Scene {
    init() {
        console.log("Overlay Scene Init");
        this.timeSinceLastLetter = 0;
        this.timePerLetter = 50;
    }

    create() {
        this.createVatBar();
        this.createMessageBox();
        this.createInstruction();
        this.createInventory();
        this.createAlertTint();
    }

    createVatBar() {
        this.vatBarBG = this.add.rectangle(center, border, width, height, 0x000000);
        this.vatBarBG.setOrigin(0, 0);
        this.vatBarBG.setStrokeStyle(4, 0xffffff);
        this.vatBarBG.visible = false;
        this.vatBarBG.depth = 90;

        this.vatBarInner = this.add.rectangle(center + 2, border + 2, width - 4, height - 4, 0x6495ed);
        this.vatBarInner.setOrigin(0, 0);
        this.vatBarInner.visible = false;
        this.vatBarInner.depth = 100;
    }

    createAlertTint() {
        this.alertTint = this.add.rectangle(0, 0, screenWidth, screenHeight, 0xff0000);
        this.alertTint.setOrigin(0, 0);
        this.alertTint.setAlpha(0);
    }

    createMessageBox() {
        this.messageBox = this.add.sprite(border, 400, 'textBox');
        this.messageBox.setOrigin(0, 0);
        this.messageBox.displayWidth = screenWidth - border * 2;
        // .22 below is the ratio of the image, needs to change if we change the image
        this.messageBox.displayHeight = this.messageBox.displayWidth * .22;
        this.messageBox.visible = false;
     
        this.messageIcon = this.add.sprite(border+15,360,'dinoFace',0);
        this.messageIcon.setOrigin(0, 0);
        this.messageIcon.visible = false;

        this.message = this.add.text(250, 425, '');
        this.message.setOrigin(0, 0);
        this.message.setFontSize(25);
        this.message.setFontFamily('Audiowide, Helvetica, Verdana, Sans');
        this.message.setColor('black');
        this.message.width = 550;
        this.message.height = 150;

        this.messageBlip = this.sound.add('speechBeep', {volume: 0.7});
    }

    createInstruction() {
        this.instruction = this.add.text(border, 70, null);
        this.instruction.setFontFamily('Helvetica, Verdana, Sans');
        this.instruction.setFontSize(20);
        this.instruction.setColor('white');
        this.instruction.setStroke('black', 2);
        this.instruction.setShadow(1, 1, '#222222', 1, true, false);
        this.instruction.visible = false;
    }

    createInventory() {
        this.inventoryStyle = {
            fontFamily: 'Helvetica, Verdana, Sans',
            fontSize: '18px',
            color: '#000',
            stroke: '#fff',
            strokeThickness: 3,
            align: 'right',
        };

        this.invBackground = this.add.image(screenWidth, 0, 'invBG');
        this.invBackground.scale = 0.7;
        this.invBackground.setOrigin(1, 0);
        this.invBackground.visible = false;

        const rightAlignPos = screenWidth - border - 30;
        //this.invFoodText = this.add.text(rightAlignPos, border, 'Food', this.inventoryStyle);
        this.invFoodIcon = this.add.sprite(rightAlignPos - 42, border + 10, 'objects',7);
        this.invFoodIcon.visible = false;
        //this.invFoodText.setOrigin(1, 0);
        //this.invFoodText.visible = false;
        //this.invFuelText = this.add.text(rightAlignPos, border + 24, 'Fuel', this.inventoryStyle);
        this.invFuelIcon = this.add.sprite(rightAlignPos + 22, border + 12, 'objects',5);
        this.invFuelIcon.visible = false;
        //this.invFuelText.setOrigin(1, 0);
        //this.invFuelText.visible = false;
        //this.invFertText = this.add.text(rightAlignPos, border + 48, 'Fertilizer', this.inventoryStyle);
        this.invFertIcon = this.add.sprite(rightAlignPos + 22, border + 74, 'objects',3);
        this.invFertIcon.visible = false;
        //this.invFertText.setOrigin(1, 0);
        //this.invFertText.visible = false;
        // Reimpliment if building is added
        // this.invBuildingText = this.add.text(rightAlignPos, border + 72, 'Uranium', this.inventoryStyle);
        // this.invBuildingText.setOrigin(1, 0);
        // this.invBuildingText.visible = false;
        
        //TODO revert when done debugging
        this.invHungerText = this.add.text(rightAlignPos, border + 150, 'Hunger', this.inventoryStyle);
        this.invHungerText.setOrigin(1, 0);
        this.invHungerText.visible = false;


        this.invFoodCount = this.add.text(rightAlignPos - 43, border + 12, '', this.inventoryStyle);
        this.invFoodCount.setOrigin(.5, .5);
        this.invFoodCount.visible = false;
        this.invFuelCount = this.add.text(rightAlignPos + 20, border + 12, '', this.inventoryStyle);
        this.invFuelCount.setOrigin(.5, .5);
        this.invFuelCount.visible = false;
        // this.invBuildingCount = this.add.text(rightAlignPos + 30, border + 72, '', this.inventoryStyle);
        // this.invBuildingCount.setOrigin(1, 0);
        // this.invBuildingCount.visible = false;
        this.invFertCount = this.add.text(rightAlignPos + 20, border + 82, '', this.inventoryStyle);
        this.invFertCount.setOrigin(.5, .5);
        this.invFertCount.visible = false;
        this.invHungerCount = this.add.text(rightAlignPos + 30, border + 150, '', this.inventoryStyle);
        this.invHungerCount.setOrigin(1, 0);
        this.invHungerCount.visible = false;
    }

    update(time, delta) {
        this.updateVatBar();
        this.updateInventory();
        this.showMessage(delta);
        this.showInstruction();
        this.updateAlert();
    }

    updateVatBar() {
        if (SystemState.showBar) {
            this.vatBarBG.visible = true;
            this.vatBarInner.visible = true;
        }
        const vatState = SystemState.getCurrentVatState();
        var updateWidth = width * vatLevels[SystemState.god.level].maxUnits/1000;

        if (updateWidth !=this.vatBarBG.width) {
            this.vatBarBG.destroy();
            this.vatBarBG = this.add.rectangle(center, border, updateWidth, height, 0x000000);
            this.vatBarBG.setOrigin(0, 0);
            this.vatBarBG.setStrokeStyle(4, 0xffffff);
            this.vatBarBG.depth = 90;
        }
        this.vatBarInner.width = (this.vatBarBG.width - 4) * vatState.percentage;
    }

    updateInventory() {
        const inv = SystemState.inventory;

        if (inv.showFood || inv.showFuel || inv.showBuilding) {
            this.invBackground.visible = true;
        }

        if (!inv.showFood && inv.food) inv.showFood = true;
        if (!inv.showFuel && inv.fuel) inv.showFuel = true;
        // if (!inv.showBuilding && inv.building) inv.showBuilding = true;
        if (!inv.showFert && inv.fert) inv.showFert = true;

        if (inv.showFood) {
           // this.invFoodText.visible = true;
           this.invFoodIcon.visible = true;
           this.invFoodCount.visible = true;
        }
        if (inv.showFuel) {
           // this.invFuelText.visible = true;
           this.invFuelIcon.visible = true;
           this.invFuelCount.visible = true;
        }
        // TODO revert after debugging
        // if (inv.showBuilding) {
        //     this.invBuildingText.visible = true;
        //     this.invBuildingCount.visible = true;
        // }

        if (inv.showFert) {
          //  this.invFertText.visible = true;
            this.invFertIcon.visible = true;
            this.invFertCount.visible = true;
        }

        //Todo turn off when done with debugging
        //this.invHungerText.visible = true;
        //this.invHungerCount.visible = true;

        this.invFoodCount.text = inv.food;
        this.invFuelCount.text = inv.fuel;
        this.invFertCount.text = inv.fert;
        // TODO revert after debugging
        this.invHungerCount.text = Math.floor(SystemState.god.hunger);
        // this.invBuildingCount.text = inv.building;
    }

    showMessage(delta) {
        var godLevel = Math.max(SystemState.god.level-1,0);
        if (SystemState.message.current) {
            this.messageBox.visible = true;
            this.messageIcon.setFrame(godLevel);
            this.messageIcon.visible = true;
            this.message.visible = true;

            this.message.text = SystemState.message.current.slice(0, SystemState.message.shown);

            if (SystemState.message.playing && !SystemState.isPaused) {
                if (!this.messageBlip.isPlaying) this.messageBlip.play();
                this.timeSinceLastLetter += delta;
                if (this.timeSinceLastLetter >= this.timePerLetter) {
                    this.timeSinceLastLetter -= this.timePerLetter;
                    SystemState.message.shown += 1;

                    if (SystemState.message.shown >= SystemState.message.current.length) {
                        SystemState.message.playing = false;
                    }
                }
            }
        } else {
            this.timeSinceLastLetter = 0;
            this.messageBox.visible = false;
            this.messageIcon.visible = false;
            this.message.visible = false;
            this.messageBlip.stop();
        }
    }

    showInstruction() {
        if (SystemState.currentInstruction) {
            this.instruction.text = "Interact to " + SystemState.currentInstruction;
            this.instruction.visible = true;
        } else {
            this.instruction.visible = false;
        }
    }

    updateAlert() {
        if(SystemState.god.hunger>500) {
            var tantrumPercent = ((SystemState.god.hunger)-500)/500;
            this.alertTint.setAlpha(tantrumPercent);
        } else {
            this.alertTint.setAlpha(0);
        }
    }
}

export default OverlayScene;