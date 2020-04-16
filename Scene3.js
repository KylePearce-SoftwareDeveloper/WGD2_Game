class Scene3 extends Phaser.Scene{
    constructor() {
        super("endGameRedWin");
    }

    create() {
        console.log("in red win state");
        this.add.text(320, 250, "RED TEAM WINS!");
    }
}