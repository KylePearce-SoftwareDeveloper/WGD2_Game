class Scene5 extends Phaser.Scene{
    constructor() {
        super("endGameDraw");
    }

    create() {
        this.add.text(320, 250, "DRAW!");
    }
}