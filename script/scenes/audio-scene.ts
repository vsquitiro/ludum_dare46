import Phaser from 'phaser';

class AudioScene extends Phaser.Scene {
    mainLoop: Phaser.Sound.BaseSound;
    create() {
        this.mainLoop = this.sound.add('mainLoop');
    }
    update() {
        if (!this.mainLoop.isPlaying) {
            this.mainLoop.play();
        }
    }
}

export default AudioScene;