//RANDOM BARRIER LOCATION LOGIC
var barrierTimmer = 0;

var player1;
var player2;
var player3;
var player4;
var flag;
var barriers;
var cursors;
var keys;
var blueScore = 0;
var redScore = 0;
var gameOver = false;
var blueScoreText;
var redScoreText;
//var game = new Phaser.Game(config);
var blueTeamBase;
var redTeamBase;
var timerText;
var timedEvent;
//  var moveBases;
var initialTime;
var runnerSpeed = 180;
var gunnerSpeed = 140;
var blueWinText;
var redWinText;
var drawText;
var flagFound = false;

var redGunnerBullets;
var blueGunnerBullets;

var barrierEvent;
var redGunnerDirection = 0;
var blueGunnerDirection = 0;

var hasSpaceBeenPressed = false;
var hasZeroBeenPressed = false;

//AUDIO
var backgroundMusic;
var backgroundMusicConfig = {
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
}
var flagScoreMusic;
var flagScoreMusicConfig = {
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: false,
    delay: 0
}
var gunShotMusic;
var gunShotMusicConfig = {
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: false,
    delay: 0
}

var Bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
    // Bullet Constructor
        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
            this.speed = 1;
            this.born = 0;
            this.directionX = 0;
            this.directionY = 0;
            this.xSpeed = 0;
            this.ySpeed = 0;
            this.setSize(12, 12, true);
        },

    // Fires a bullet from the player
    fire: function (shooter)
    {
        this.setPosition(shooter.x, shooter.y); // Initial position
        if(shooter.angle == 0)
        {
            this.directionX = 1;
            this.directionY = 0;
        }

        if(shooter.angle == 90)
        {
            this.directionY = 1;
            this.directionX = 0;
        }

        if(shooter.angle == -180)
        {
            this.directionX = -1;
            this.directionY = 0;
        }

        if(shooter.angle == -90)
        {
            this.directionY = -1;
            this.directionX = 0;
        }

        this.xSpeed = this.speed*this.directionX;
        this.ySpeed = this.speed*this.directionY;

        this.born = 0; // Time since new bullet spawned
    },

    // Updates the position of the bullet each cycle
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
});

function movePlayer(player, up, down, left, right, velocity)
{
    if (left.isDown)
    {
        player.setVelocityX(-velocity);
        player.angle = 180;
    }
    else if (right.isDown)
    {
        player.setVelocityX(velocity);
        player.angle = 0;
    }
    else if (up.isDown && player.y >= 62)
    {
        player.setVelocityY(-velocity);
        player.angle = 270;
    }
    else if (down.isDown)
    {
        player.setVelocityY(velocity);
        player.angle = 90;
    }
    else
    {
        player.setVelocityX(0);
        player.setVelocityY(0);
    }
}

function collectFlag (player, flag)
{
    flag.x = player.x;
    flag.y = player.y;
    flagFound = true;
}

function flagToBlueBaseCollide ()
{
    resetFlag();
    //  Add and update the score
    blueScore += 1;
    blueScoreText.setText('Blue Score: ' + blueScore);
    this.flagScoreMusic.play(flagScoreMusicConfig);//AUDIO
}

function flagToRedBaseCollide ()
{
    resetFlag();
    //  Add and update the score
    redScore += 1;
    redScoreText.setText('Red Score: ' + redScore);
    this.flagScoreMusic.play(flagScoreMusicConfig);//AUDIO
}

function formatTime(seconds){
    // Minutes
    var minutes = Math.floor(seconds/60);
    // Seconds
    var partInSeconds = seconds%60;
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2,'0');
    // Returns formatted time
    return `${minutes}:${partInSeconds}`;
}

function onEvent()
{
    initialTime -= 1; // One second
    timerText.setText(formatTime(initialTime));

    if (initialTime <= -1 ){
        gameOver = true;
        initialTime.stop();

    }
}

function playerOneHit(enemyHit, bulletHit)
{
    // Reduce health of enemy
    if (bulletHit.active === true && enemyHit.active === true)
    {
        // Destroy bullet
        bulletHit.setActive(false).setVisible(false);
        enemyHit.x = 745;
        enemyHit.y = 490;

        if(flagFound)
        {
            resetFlag();
        }
    }
}
function playerTwoHit(enemyHit, bulletHit) {
    // Reduce health of enemy
    if (bulletHit.active === true && enemyHit.active === true) {

        // Destroy bullet
        bulletHit.setActive(false).setVisible(false);
        enemyHit.x = 690;
        enemyHit.y = 550;
    }
}
function playerThreeHit(enemyHit, bulletHit)
{
    // Reduce health of enemy
    if (bulletHit.active === true && enemyHit.active === true)
    {
        // Destroy bullet
        bulletHit.setActive(false).setVisible(false);
        enemyHit.x = 115;
        enemyHit.y = 95;

        if(flagFound)
        {
            resetFlag();
        }
    }
}
function playerFourHit(enemyHit, bulletHit)
{
    // Reduce health of enemy
    if (bulletHit.active === true && enemyHit.active === true)
    {
        // Destroy bullet
        bulletHit.setActive(false).setVisible(false);
        enemyHit.x = 60;
        enemyHit.y = 155;
    }
}

function resetFlag ()
{
    flag.x = 400;
    flag.y = 300;
}

function shuffleBarriers() {
    barriers.clear(true);
    //CREATE NEW RANDOM POSITIONS FOR BARRIERS
    //first half of window
    var x1 = Phaser.Math.Between(136, 350);//vert
    var y1 = Phaser.Math.Between(216, 500);
    var x2 = Phaser.Math.Between(186, 300);//horz
    var y2 = Phaser.Math.Between(166, 550);
    var x3 = Phaser.Math.Between(136, 350);//cubeoid
    var y3 = Phaser.Math.Between(166, 550);
    var x4 = Phaser.Math.Between(111, 375);//vertVariation
    var y4 = Phaser.Math.Between(316, 400);
    var x5 = Phaser.Math.Between(286, 200);//horzVariation
    var y5 = Phaser.Math.Between(141, 575);
    //second half of window
    var x6 = Phaser.Math.Between(450, 669);//vert
    var y6 = Phaser.Math.Between(100, 421);
    var x7 = Phaser.Math.Between(500, 619);//horz
    var y7 = Phaser.Math.Between(50, 471);
    var x8 = Phaser.Math.Between(450, 669);//cuboid
    var y8 = Phaser.Math.Between(50, 471);
    var x9 = Phaser.Math.Between(425, 694);//vertVariation
    var y9 = Phaser.Math.Between(200, 321);
    var x10 = Phaser.Math.Between(600, 519);//horzVariation
    var y10 = Phaser.Math.Between(25, 496);
    //CREATE NEW BARRIERS WITH RANDOM POSITIONS
    //first half of window
    barriers.create(x1, y1, 'vertBarrier');
    barriers.create(x2, y2, 'horzBarrier');
    barriers.create(x3, y3, 'cubeBarrier');
    barriers.create(x4, y4, 'vertBarrierVariation');
    barriers.create(x5, y5, 'horzBarrierVariation');
    //second half of window
    barriers.create(x6, y6, 'vertBarrier');
    barriers.create(x7, y7, 'horzBarrier');
    barriers.create(x8, y8, 'cubeBarrier');
    barriers.create(x9, y9, 'vertBarrierVariation');
    barriers.create(x10, y10, 'horzBarrierVariation');
}

class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    /*create() {
        this.add.text(20, 20, "Loading game...")
        this.scene.start("playGame")
    }*/


    preload ()
    {
        this.load.image('background', 'assets/texture/background.png');
        this.load.image('flag', 'assets/texture/flag.png');
        this.load.image('blueGunner', 'assets/texture/blueGunner.png');
        this.load.image('blueRunner', 'assets/texture/blueRunner.png');
        this.load.image('redGunner', 'assets/texture/redGunner.png');
        this.load.image('redRunner', 'assets/texture/redRunner.png');
        this.load.image('redBase', 'assets/texture/redBase.png');
        this.load.image('blueBase', 'assets/texture/blueBase.png');
        this.load.image('bullet', 'assets/texture/bullet.png');

        //RANDOM BARRIER LOCATION LOGIC
        this.load.image('vertBarrier', 'assets/texture/verticalBarrier.png');
        this.load.image('horzBarrier', 'assets/texture/horizontalBarrier.png');
        this.load.image('cubeBarrier', 'assets/texture/cuboidBarrier.png');
        this.load.image('horzBarrierVariation', 'assets/texture/horizontalBarrierVariation.png');
        this.load.image('vertBarrierVariation', 'assets/texture/verticalBarrierVariation.png');

        //AUDIO
        this.load.audio('backgroundMusic', 'assets/audio/background.mp3');
        this.load.audio('flagScoreMusic', 'assets/audio/powerup.wav');
        this.load.audio('gunShotMusic', 'assets/audio/fire.ogg');
    }

    create ()
    {
        //  A simple background for our game
        this.add.image(400, 300, 'background');

        blueGunnerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        redGunnerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

        //set timer to 5 minutes
        initialTime = 300;//300;
        // Each 1000 ms call onEvent
        timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });
        barrierEvent = this.time.addEvent({ delay: 30000, callback: shuffleBarriers, callbackScope: this, loop: true });
        // moveBases = this.time.addEvent({ delay: 1000, callback: moveBase, callbackScope: this, loop: true });

        //RANDOM BARRIER LOCATION LOGIC
        barriers = this.physics.add.staticGroup();
        // create  barriers
        barriers.create(100, 300, 'vertBarrier');
        barriers.create(400, 500, 'horzBarrier');
        barriers.create(300, 200, 'horzBarrier');
        barriers.create(600, 300, 'vertBarrier');
        barriers.create(250, 350, 'cubeBarrier');
        barriers.create(470, 270, 'cubeBarrier');
        barriers.create(300, 200, 'horzBarrierVariation');
        barriers.create(600, 300, 'vertBarrierVariation');
        barriers.create(250, 350, 'horzBarrierVariation');
        barriers.create(470, 270, 'vertBarrierVariation');

        // creating objects
        blueTeamBase = this.physics.add.sprite(750, 550, 'blueBase');
        redTeamBase = this.physics.add.sprite(47, 100, 'redBase');
        player1 = this.physics.add.sprite(745, 490, 'blueRunner');
        player1.body.setAllowGravity(false).setCollideWorldBounds(true);
        player2 = this.physics.add.sprite(680, 550, 'blueGunner');
        player2.body.setAllowGravity(false).setCollideWorldBounds(true);
        player2.angle = 180;
        player3 = this.physics.add.sprite(115, 95, 'redRunner');
        player3.body.setAllowGravity(false).setCollideWorldBounds(true);
        player4 = this.physics.add.sprite(60, 155, 'redGunner');
        player4.body.setAllowGravity(false).setCollideWorldBounds(true);
        flag = this.physics.add.sprite(400, 300, 'flag');

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
        keys = this.input.keyboard.addKeys(
            {   W:Phaser.Input.Keyboard.KeyCodes.W,
                S:Phaser.Input.Keyboard.KeyCodes.S,
                A:Phaser.Input.Keyboard.KeyCodes.A,
                D:Phaser.Input.Keyboard.KeyCodes.D,
                Y:Phaser.Input.Keyboard.KeyCodes.Y,
                H:Phaser.Input.Keyboard.KeyCodes.H,
                G:Phaser.Input.Keyboard.KeyCodes.G,
                J:Phaser.Input.Keyboard.KeyCodes.J,
                NUMPAD_FIVE:Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE,
                NUMPAD_TWO:Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO,
                NUMPAD_ONE:Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE,
                NUMPAD_THREE:Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE,
                NUMPAD_ZERO: Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO,
                SPACE:Phaser.Input.Keyboard.KeyCodes.SPACE
            });

        //  The scores
        redScoreText = this.add.text(20, 12, 'Red Score: ' + redScore, { fontSize: '32px', fill: '#000' });
        blueScoreText = this.add.text(530, 12, 'Blue Score: ' + blueScore, { fontSize: '32px', fill: '#000' });
        timerText = this.add.text(360, 12, '', { fontSize: '32px', fill: '#000' });
        blueWinText = this.add.text(320, 200, 'BLUE WINS', { fontSize: '32px', fill: 'blue'});
        blueWinText.visible = false;
        redWinText = this.add.text(320, 200, 'RED WINS', { fontSize: '32px', fill: 'red'});
        redWinText.visible = false;
        drawText = this.add.text(320, 200, 'ITS A DRAW', { fontSize: '32px', fill: 'black'});
        drawText.visible = false;

        //  Collide the player and the flag with the platforms
        this.physics.add.collider(player1, barriers);
        this.physics.add.collider(player2, barriers);
        this.physics.add.collider(player3, barriers);
        this.physics.add.collider(player4, barriers);

        //  Checks to see if the player overlaps with any of the collectible, if he does call the collectStar function
        this.physics.add.overlap(player1, flag, collectFlag, null, this);
        this.physics.add.overlap(player3, flag, collectFlag, null, this);

        this.physics.add.overlap(flag, blueTeamBase, flagToBlueBaseCollide, null, this);
        this.physics.add.overlap(flag, redTeamBase, flagToRedBaseCollide, null, this);

        //AUDIO
        this.backgroundMusic = this.sound.add('backgroundMusic')
        this.flagScoreMusic = this.sound.add('flagScoreMusic')
        this.gunShotMusic = this.sound.add('gunShotMusic')
        this.backgroundMusic.play(backgroundMusicConfig);
    }


    update ()
    {
        if (initialTime <=  0)
        {
            gameOver = true;
            initialTime +=1;

            if (gameOver === true) {
                if(blueScore > redScore){
                    console.log("blue team won");
                    blueWinText.visible = true;
                    this.scene.start("endGameBlueWin")
                }
                if(redScore > blueScore){
                    console.log("red team won");
                    redWinText.visible = true;
                    this.scene.start("endGameRedWin")
                }
                if(redScore=== blueScore){
                    drawText.visible = true;
                    this.scene.start("endGameDraw")
                }
            }
        }

        movePlayer(player1,cursors.up, cursors.down, cursors.left, cursors.right, runnerSpeed);
        movePlayer(player2, keys.NUMPAD_FIVE, keys.NUMPAD_TWO, keys.NUMPAD_ONE, keys.NUMPAD_THREE, gunnerSpeed);
        movePlayer(player3, keys.W, keys.S, keys.A, keys.D, runnerSpeed);
        movePlayer(player4, keys.Y, keys.H, keys.G, keys.J, gunnerSpeed);

        if(!hasSpaceBeenPressed)
        {
            if (keys.SPACE.isDown) {
                if (player4.active === false)
                    return;

                // Get bullet from bullets group
                var bullet = redGunnerBullets.get().setActive(true).setVisible(true);

                if (bullet) {
                    bullet.fire(player4);
                    this.gunShotMusic.play(gunShotMusicConfig);
                    this.physics.add.collider(player1, bullet, playerOneHit);
                    this.physics.add.collider(player2, bullet, playerTwoHit);
                }

                hasSpaceBeenPressed = true;
            }
        }
        if(keys.SPACE.isUp)
        {
            hasSpaceBeenPressed = false;
        }

        if(!hasZeroBeenPressed)
        {
            if (keys.NUMPAD_ZERO.isDown) {
                if (player2.active === false)
                    return;

                // Get bullet from bullets group
                var bullet = blueGunnerBullets.get().setActive(true).setVisible(true);

                if (bullet) {
                    bullet.fire(player2);
                    this.gunShotMusic.play(gunShotMusicConfig);
                    this.physics.add.collider(player3, bullet, playerThreeHit);
                    this.physics.add.collider(player4, bullet, playerFourHit);
                }
                hasZeroBeenPressed = true;
            }
        }
        if(keys.NUMPAD_ZERO.isUp)
        {
            hasZeroBeenPressed = false;
        }
    }
}