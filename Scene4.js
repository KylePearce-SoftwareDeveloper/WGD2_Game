class Scene4 extends Phaser.Scene{
    constructor() {
        super("endGameBlueWin");
    }

    create() {
        console.log("in blue win state");
        this.add.text(320, 250, "BLUE TEAM WINS!");
    }
}