var keys;

class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    create() {
        this.add.text(250, 50, "Welcome to Runners & Gunners!");
        this.add.text(130, 100, "Click in the game window for your keyboard to gain focus");
        this.add.text(200, 200, "Controlls:");
        this.add.text(250, 225, "Red Runner - WASD");
        this.add.text(250, 250, "Red Gunner - YGHJ");
        this.add.text(250, 275, "Red Runner - Arrow Keys");
        this.add.text(250, 300, "Red Runner - 5123");
        this.add.text(250, 400, "PRESS SPACE TO PLAY THE GAME!");
        //this.scene.start("playGame");
        keys = this.input.keyboard.addKeys({SPACE:Phaser.Input.Keyboard.KeyCodes.SPACE});
    }

    update(){
        if (keys.SPACE.isDown) {
            this.scene.start("playGame");
        }
    }
}