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

let player;
let cursors;
let target = new Phaser.Math.Vector2();
let allowButton = true;
let parapets;
let winnerBlocks;
let smugFrogs;
let scoreText;
let score = 0;
let scoreArrayOrig = 7;
let scoreArray = [];

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
    this.load.spritesheet(
        'frogger_spritesheet',
        'assets/frogger/frogger_spritesheet.png',
        {frameWidth: SPRITE_SIZE, frameHeight: SPRITE_SIZE}
    );
    // this.load.atlas("new_spritesheet", "assets/frogger/spritesheet.png", "assets/frogger/spritesheet.json");
    this.load.image('ground', 'assets/frogger/icon-frogger-pixel-512x512.png');
}


function create () {
    scoreArray.push(scoreArrayOrig);
    cursors = this.input.keyboard.createCursorKeys();

    let parapetPositionX = -0.5;
    let parapetPositionY = 2.5;
    // let numParapets = 6;

    // Load here for debugging.
    // bgImage = this.add.image(GAME_WIDTH * gameScale / 2, GAME_HEIGHT * gameScale / 2, 'frogger_bg');
    // bgImage.setScale(gameScale);

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

    // Creates the sprite to just stand still.
    this.anims.create({
        key: 'still',
        frames: this.anims.generateFrameNumbers('frogger_spritesheet', {start: 2, end: 2}),
        frameRate: 1,
        repeat: 1
    });

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

    player.setScale(gameScale);
    player.anims.play('still', true);
    // player.frame = 6;

    // Set the colliders.
    this.physics.add.collider(player, parapets, deadFroggo, null, this);
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
}

function deadFroggo(player, wall) {
    player.setTint(0xff0000);
    gameOver = true;
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
    // target.x = player_origHorizLevel;
    // target.y = player_origVertLevel;
    // player.setTint(0x00ff00);
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