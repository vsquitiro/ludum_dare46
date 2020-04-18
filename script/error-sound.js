class ErrorSound {
    constructor(scene) {
        this.scene = scene;
        this.error1 = this.scene.sound.add('error1');
        this.error2 = this.scene.sound.add('error2');
    }

    playErrorSound() {
        const choice = Math.random();

        if (choice < 0.5) {
            this.error1.play();
        } else {
            this.error2.play();
        }
    }
}

export default ErrorSound;