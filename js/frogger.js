const GAME_SIZE = 256;
const GAME_WIDTH = 224;
const GAME_HEIGHT = 256;
const GAME_HEIGHT_REMOVAL = 150;
const SPRITE_SIZE = 16;
// The levels the sprite is at.
const MIN_V_LEVEL = 1;
const MAX_V_LEVEL = 13;
const MIN_H_LEVEL = 1;
const MAX_H_LEVEL = 13;

const PLAYER_SPEED = 500;

let availableHt = window.screen.availHeight;
let availableW = window.screen.availWidth;
let gameScale = (availableHt - GAME_HEIGHT_REMOVAL) / GAME_SIZE;

let player_origVertLevel = MIN_V_LEVEL;
let player_origHorizLevel = 7;

let player_vertLevel = player_origVertLevel;
let player_horizLevel = player_origHorizLevel;

// Starting point for Frogger
let spritePositionHz = GAME_WIDTH * gameScale / 2;
let spritePositionV = GAME_HEIGHT * gameScale - (SPRITE_SIZE * gameScale * 1.5);
let target = new Phaser.Math.Vector2();
let allowButton = true;

// Game objects.
let player;
let cursors;
let parapets;
let winnerBlocks;
let smugFrogs;
let scoreText;
let score = 0;
let scoreArrayOrig = 7;
let scoreArray = [];
let goldCar;
let timer;

let config = {
    type: Phaser.AUTO,
    parent: 'arghcade',
    width: GAME_WIDTH * gameScale,
    height: GAME_HEIGHT * gameScale,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

function preload () {
    this.load.image('froggo', 'assets/frogger/icon-frogger-pixel-512x512.png');
    this.load.image('frogger_bg', 'assets/frogger/frogger_bg_plain.png');
    this.load.image('blank', 'assets/frogger/blank1616.png');
    this.load.image('ground', 'assets/frogger/icon-frogger-pixel-512x512.png');

    // Load the spritesheet.
    this.load.spritesheet(
        'frogger_spritesheet',
        'assets/frogger/frogger_spritesheet.png',
        {frameWidth: SPRITE_SIZE, frameHeight: SPRITE_SIZE}
    );

}


function create () {
    // create a timer for use throught the game.
    timer = this.time.addEvent({
        delay: 999999,
        paused: false
    });

    // this.input.on('pointerdown', function () {
    //     timer.paused = !timer.paused;
    // });

    scoreArray.push(scoreArrayOrig);
    cursors = this.input.keyboard.createCursorKeys();

    let parapetPositionX = -0.5;
    let parapetPositionY = 2.5;

    // Create the Parapets at the end of the course that froggo can crash into.
    parapets = this.physics.add.staticGroup({
        key: 'blank',
        repeat: 6,
        setXY: {x: (parapetPositionX) * SPRITE_SIZE * gameScale, y: parapetPositionY * SPRITE_SIZE * gameScale, stepX: SPRITE_SIZE * gameScale * 3}
    });

    parapets.children.iterate(function (child) {
        // child.setScale(gameScale);
        child.scaleX = 2 + gameScale;
    });

    // Create target blocks for froggo to jump into.
    winnerBlocks = this.physics.add.staticGroup({
        key: 'blank',
        repeat: 5,
        setXY: {x: (parapetPositionX + 1.5) * SPRITE_SIZE * gameScale, y: parapetPositionY * SPRITE_SIZE * gameScale, stepX: SPRITE_SIZE * gameScale * 3}
    });

    bgImage = this.add.image(GAME_WIDTH * gameScale / 2, GAME_HEIGHT * gameScale / 2, 'frogger_bg');
    bgImage.setScale(gameScale);

    scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#fff'});

    // Place the froggo.
    player = this.physics.add.sprite(spritePositionHz, spritePositionV , 'frogger_spritesheet');
    player.setCollideWorldBounds(true);

    // Just froggo looking ahead.
    this.anims.create({
        key: 'ahead',
        frames: this.anims.generateFrameNumbers('frogger_spritesheet', {start: 1, end: 2}),
        frameRate: 15,
        repeat: 1
    });

    // Creates the sprite for the winner froggo
    this.anims.create({
        key: 'smuggy',
        frames: this.anims.generateFrameNumbers('frogger_spritesheet', {start: 64, end: 64}),
        frameRate: 10,
        repeat: -1
    });

    // Green frog in parapet
    smugFrogs = this.physics.add.group({
        key: 'smuggy',
        repeat: 5,
        setXY: {x: (parapetPositionX + 1.5) * SPRITE_SIZE * gameScale, y: parapetPositionY * SPRITE_SIZE * gameScale, stepX: SPRITE_SIZE * gameScale * 3}
    });

    smugFrogs.children.iterate(function (child) {
        // child.setScale(gameScale);
        child.anims.play('smuggy', true);
        child.setVisible(false);
    });

    // create the gold car sprite
    this.anims.create({
        key: 'goldCar',
        frames: this.anims.generateFrameNumbers('frogger_spritesheet', {start: 3, end: 3}),
        frameRate: 10,
        repeat: 1
    });

    let goldCarX = GAME_WIDTH * gameScale;
    let goldCarY = GAME_HEIGHT * gameScale - SPRITE_SIZE * gameScale * 2.5;
    let goldCarStep = SPRITE_SIZE * gameScale * 3;

    goldCar = this.physics.add.group({
        key: 'goldCar',
        repeat: 1,
        setXY: {x: goldCarX, y: goldCarY, stepX: goldCarStep}
    })

    goldCar.children.iterate(function (child) {
        child.setScale(gameScale);
        child.anims.play('goldCar', true);
    });


    player.setScale(gameScale);
    player.setFrame(2)

    // Set the colliders.
    this.physics.add.collider(player, parapets, deadFroggo, null, this);
    this.physics.add.collider(player, goldCar, deadFroggo, null, this);
    this.physics.add.overlap(player, winnerBlocks, winFroggo);
    this.physics.add.overlap(player, smugFrogs, showSmuggy, null, this);
}

function update () {
    if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
        if (allowButton && player_vertLevel < MAX_V_LEVEL) {
            allowButton = false;
            player.angle = 0;
            player.anims.play('ahead', true);
            target.x = player.x;
            target.y = player.y - SPRITE_SIZE * gameScale;
            this.physics.moveToObject(player, target, PLAYER_SPEED);
            player_vertLevel ++;
            upScore();
        }

    } else if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
        if (allowButton && player_vertLevel > MIN_V_LEVEL) {
            allowButton = false;
            player.angle = 180;
            player.anims.play('ahead', true);
            target.x = player.x;
            target.y = player.y + SPRITE_SIZE * gameScale;
            this.physics.moveToObject(player, target, PLAYER_SPEED);
            player_vertLevel --;
        }

    } else if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
        if (allowButton && player_horizLevel > MIN_H_LEVEL) {
            allowButton = false;
            player.angle = 270;
            player.anims.play('ahead', true);
            target.x = player.x - SPRITE_SIZE * gameScale;
            target.y = player.y;
            this.physics.moveToObject(player, target, PLAYER_SPEED);
            player_horizLevel --;
        }

    } else if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
        if (allowButton && player_horizLevel < MAX_H_LEVEL) {
            allowButton = false;
            player.angle = 90;
            player.anims.play('ahead', true);
            target.x = player.x + SPRITE_SIZE * gameScale;
            target.y = player.y;
            this.physics.moveToObject(player, target, PLAYER_SPEED);
            player_horizLevel ++;
        }

    }

    let distance = Phaser.Math.Distance.Between(player.x, player.y, target.x, target.y);

    if (player.body.speed > 0) {
        //  4 is our distance tolerance, i.e. how close the source can get to the target
        //  before it is considered as being there. The faster it moves, the more tolerance is required.
        if (distance < 4)
        {
            player.body.reset(target.x, target.y);
            allowButton = true;
        }
    }

    goldCar.children.each(function(car) {
        car.setVelocityX(-160);
        moveGoldCar(car);
    }, this);

    // text
    //     .setFill(timer.paused ? cssColors.yellow : cssColors.aqua)
    //     .setText(timer.getElapsedSeconds().toFixed(1));
}

function moveGoldCar(car) {
    // moves car back to start
    if (car.x < 0 ) {
        console.log("move car");
        // car.body.stop();
        car.body.reset(GAME_WIDTH * gameScale, car.y);
    }
}

function deadFroggo(player, wall) {
    player.setTint(0xff0000);
    // this.scene.pause();
    // pause for two seconds
    let targetTime = timer.getElapsedSeconds() + 5;
    // TODO move this to the update section... der!
    if (targetTime > timer.getElapsedSeconds) {
        // player.body.moves = false;
        game.paused = true;
        console.log('paused');
        console.log(targetTime, timer.getElapsedSeconds());
    }
    winFroggo(player)
    game.paused = false;
    // console.log('unpaused');
    gameOver = false;
}

function showSmuggy(player, smuggy) {
    smuggy.setScale(gameScale);
    smuggy.setVisible(true);
    smuggy.setActive(false);
}

function winFroggo(player) {
    player.body.stop();
    player.body.reset(spritePositionHz, spritePositionV);
    allowButton = true;
    player_horizLevel = player_origHorizLevel;
    player_vertLevel = player_origVertLevel;
}

function upScore() {
    console.log("vert level: ", player_vertLevel);
    if (scoreArray.includes(player_vertLevel)) {
        console.log("already scored");
    } else if (player_vertLevel === 13) {
        score += 50;
        scoreArray = [];
        scoreArray.push(scoreArrayOrig);
    } else {
        // Check the score is valid
        scoreArray.push(player_vertLevel);
        score += 10;
    }
    scoreText.setText('Score: ' + score);
}
