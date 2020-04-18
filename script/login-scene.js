/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';
import ErrorSound from './error-sound.js';

const focusColor = 0x03c2fc;
const wrongColor = 0xfc0303;

class LoginScene extends Phaser.Scene {
    typedUsername = "";
    typedPassword = "";
    currentFocus = "username";
    maxChars = 14;

    create() {
        // Audio
        this.errorSound = new ErrorSound(this);

        // Add logo
        this.logoMap = this.make.tilemap({key: "systemTilemap"});
        const tileset = this.logoMap.addTilesetImage('System', 'sysTile');
        this.logoLayer = this.logoMap.createStaticLayer('Logo', tileset, undefined, 0);

        // Create input boxes
        this.usernameBox = this.add.rectangle(
            10 * 32,
            10 * 32,
            5 * 32,
            1 * 32
        );
        this.usernameBox.setStrokeStyle(2, focusColor);
        this.usernameBox.setOrigin(0, 0);
        this.passwordBox = this.add.rectangle(
            10 * 32,
            11 * 32 + 16,
            5 * 32,
            1 * 32
        );
        this.passwordBox.setStrokeStyle(2, 0xffffff);
        this.passwordBox.setOrigin(0, 0);

        this.usernameDisplay = this.add.text(
            10 * 32 + 5,
            10 * 32 + 16,
            this.typedUsername
        );
        this.usernameDisplay.setOrigin(0, 0.5);
        this.passwordDisplay = this.add.text(
            10 * 32 + 5,
            12 * 32,
            this.typedPassword
        );
        this.passwordDisplay.setOrigin(0, 0.5);

        // Login button
        this.loginButton1 = this.add.sprite(
            11 * 32 + 16,
            13 * 32 + 16,
            'sysTile',
            128
        );
        this.loginButton1.setInteractive({ cursor: 'pointer' }).on('pointerdown', function() {
            this.submit();
        }, this);
        this.loginButton2 = this.add.sprite(
            12 * 32 + 16,
            13 * 32 + 16,
            'sysTile',
            129
        );
        this.loginButton2.setInteractive({ cursor: 'pointer' }).on('pointerdown', function() {
            this.submit();
        }, this);
        this.loginButton3 = this.add.sprite(
            13 * 32 + 16,
            13 * 32 + 16,
            'sysTile',
            130
        );
        this.loginButton3.setInteractive({ cursor: 'pointer' }).on('pointerdown', function() {
            this.submit();
        }, this);

        // Input handling
        this.input.keyboard.addCapture('SPACE,TAB,BACKSPACE');
        const bscode = Phaser.Input.Keyboard.KeyCodes.BACKSPACE;
        const tab = Phaser.Input.Keyboard.KeyCodes.TAB;
        const enter = Phaser.Input.Keyboard.KeyCodes.ENTER;
        const acode = Phaser.Input.Keyboard.KeyCodes.A;
        const zcode = Phaser.Input.Keyboard.KeyCodes.Z;
        const zeroCode = Phaser.Input.Keyboard.KeyCodes.ZERO;
        const nineCode = Phaser.Input.Keyboard.KeyCodes.NINE;

        this.input.keyboard.on('keydown', function (event) {
            if (this.currentFocus == "") {
                return;
            }
            let curEntry = this.currentFocus == "username" ? this.typedUsername : this.typedPassword;

            if ((event.keyCode >= acode && event.keyCode <= zcode) || (event.keyCode >= zeroCode && event.keyCode <= nineCode)) {
                if ((curEntry + event.key).length <= this.maxChars) {
                    curEntry += event.key;
                }
                this.updateText(curEntry, this.currentFocus);
            } else if (event.keyCode === bscode && curEntry.length) {
                curEntry = curEntry.substr(0, curEntry.length - 1);
                this.updateText(curEntry, this.currentFocus);
            } else if (event.keyCode === tab) {
                this.toggleEntry();
            } else if (event.keyCode === enter) {
                this.submit();
            }
        }, this);
        this.usernameBox.setInteractive({ cursor: 'pointer' });
        this.usernameBox.on('pointerdown', function(pointer) {
            this.setUsernameFocus();
        }, this);
        this.passwordBox.setInteractive({ cursor: 'pointer' });
        this.passwordBox.on('pointerdown', function(pointer) {
            this.setPasswordFocus();
        }, this);
    }
    update(time, delta) {
        
    }

    updateLoginSprites() {
        if (this.typedUsername == "" || this.typedPassword == "") {
            this.loginButton1.setFrame(128);
            this.loginButton2.setFrame(129);
            this.loginButton3.setFrame(130);
        } else {
            this.loginButton1.setFrame(111);
            this.loginButton2.setFrame(112);
            this.loginButton3.setFrame(113);
        }
    }

    toggleEntry() {
        if (this.currentFocus == "username") {
            this.setPasswordFocus();
        } else if (this.currentFocus == "password") {
            this.setUsernameFocus();
        }
    }

    setUsernameFocus() {
        this.currentFocus = "username";
        this.usernameBox.setStrokeStyle(2, focusColor);
        this.passwordBox.setStrokeStyle(2, 0xffffff);
    }

    setPasswordFocus() {
        this.currentFocus = "password";
        this.usernameBox.setStrokeStyle(2, 0xffffff);
        this.passwordBox.setStrokeStyle(2, focusColor);
    }

    updateText(curEntry, toUpdate) {
        if (toUpdate == "username" && curEntry != this.typedUsername) {
            this.typedUsername = curEntry;
            this.usernameDisplay.setText(this.typedUsername);
        } else if (toUpdate == "password" && curEntry != this.typedPassword) {
            this.typedPassword = curEntry;
            var crypticPassword = "";
            for (let i = 0; i < curEntry.length; i++) {
                crypticPassword += "•";
            }
            this.passwordDisplay.setText(crypticPassword);
        }
        this.updateLoginSprites();
    }
    
    submit() {
        if (this.typedUsername == "" || this.typedPassword == "") {
            return;
        }
        if (this.typedUsername == globalConfig.correctUsername && this.typedPassword == globalConfig.correctPassword) {
            SystemState.login();
        } else {
            this.errorSound.playErrorSound();
            this.updateText("", "username");
            this.usernameBox.setStrokeStyle(2, wrongColor);
            this.updateText("", "password");
            this.passwordBox.setStrokeStyle(2, wrongColor);
            this.currentFocus = "";
            setTimeout(() => {
                this.setUsernameFocus();
            }, 2000);
        }
    }
}

export default LoginScene;