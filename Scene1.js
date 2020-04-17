var keys;

class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    create() {
        this.add.text(250, 50, "Welcome to Runners & Gunners!");
        this.add.text(130, 100, "Click in the game window for your keyboard to gain focus");
        this.add.text(150, 200, "Controls:");
        this.add.text(200, 225, "Red Runner - WASD");
        this.add.text(200, 250, "Red Gunner - YGHJ, space key to fire");
        this.add.text(200, 275, "Blue Runner - Arrow Keys");
        this.add.text(200, 300, "Blue Gunner - 5123, 0 key to fire (turn off 'num lock')");
        this.add.text(200, 400, "PRESS SPACE TO PLAY THE GAME!");
        //this.scene.start("playGame");
        keys = this.input.keyboard.addKeys({SPACE:Phaser.Input.Keyboard.KeyCodes.SPACE});
    }

    update(){
        if (keys.SPACE.isDown) {
            this.scene.start("playGame");
        }
    }
}