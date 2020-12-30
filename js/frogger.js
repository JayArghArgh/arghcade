const GAME_SIZE = 256;
const GAME_WIDTH = 224;
const GAME_HEIGHT = 256;
const SPRITE_SIZE = 16;
const MIN_V_LEVEL = 1;
const MAX_V_LEVEL = 13;
const MIN_H_LEVEL = 1;
const MAX_H_LEVEL = 13;
const PLAYER_SPEED = 500;

let availableHt = window.screen.availHeight;
let availableW = window.screen.availWidth;
let gameScale = (availableHt - 100) / GAME_SIZE;
let player_vertLevel = MIN_V_LEVEL;
let player_horizLevel = 7;

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

console.log(window.screen);

let game = new Phaser.Game(config);
let player;
let cursors;
let target = new Phaser.Math.Vector2();
let allowButton = true;
let parapets;
let winnerBlocks;

function preload () {
    this.load.image('froggo', 'assets/frogger/icon-frogger-pixel-512x512.png');
    this.load.image('frogger_bg', 'assets/frogger/frogger_bg.png');
    this.load.image('blank', 'assets/frogger/blank1616.png');
    this.load.spritesheet(
        'frogger_spritesheet',
        'assets/frogger/frogger_spritesheet.png',
        {frameWidth: SPRITE_SIZE, frameHeight: SPRITE_SIZE}
        );
    this.load.image('ground', 'assets/frogger/icon-frogger-pixel-512x512.png');
}


function create () {

    cursors = this.input.keyboard.createCursorKeys();

    let parapetPositionX = -0.5;
    let parapetPositionY = 2.5;
    // let numParapets = 6;

    // Create the Parapets at the end of the course that froggo can crash into.
    parapets = this.physics.add.staticGroup();
    parapets.create((parapetPositionX) * SPRITE_SIZE * gameScale, parapetPositionY * SPRITE_SIZE * gameScale, 'blank').scaleX = 2 + gameScale;
    parapets.create((parapetPositionX + 3) * SPRITE_SIZE * gameScale, parapetPositionY * SPRITE_SIZE * gameScale, 'blank').scaleX = 2 + gameScale;
    parapets.create((parapetPositionX + 6) * SPRITE_SIZE * gameScale, parapetPositionY * SPRITE_SIZE * gameScale, 'blank').scaleX = 2 + gameScale;
    parapets.create((parapetPositionX + 9) * SPRITE_SIZE * gameScale, parapetPositionY * SPRITE_SIZE * gameScale, 'blank').scaleX = 2 + gameScale;
    parapets.create((parapetPositionX + 12) * SPRITE_SIZE * gameScale, parapetPositionY * SPRITE_SIZE * gameScale, 'blank').scaleX = 2 + gameScale;
    parapets.create((parapetPositionX + 15) * SPRITE_SIZE * gameScale, parapetPositionY * SPRITE_SIZE * gameScale, 'blank').scaleX = 2 + gameScale;

    bgImage = this.add.image(GAME_WIDTH * gameScale / 2, GAME_HEIGHT * gameScale / 2, 'frogger_bg');
    bgImage.setScale(gameScale);

    // Create target blocks for froggo to jump into.
    winnerBlocks = this.physics.add.staticGroup();
    winnerBlocks.create((parapetPositionX + 1.5) * SPRITE_SIZE * gameScale, parapetPositionY * SPRITE_SIZE * gameScale, 'blank').scaleX = .5 + gameScale;
    winnerBlocks.create((parapetPositionX + 4.5) * SPRITE_SIZE * gameScale, parapetPositionY * SPRITE_SIZE * gameScale, 'blank').scaleX = .5 + gameScale;
    winnerBlocks.create((parapetPositionX + 7.5) * SPRITE_SIZE * gameScale, parapetPositionY * SPRITE_SIZE * gameScale, 'blank').scaleX = .5 + gameScale;
    winnerBlocks.create((parapetPositionX + 10.5) * SPRITE_SIZE * gameScale, parapetPositionY * SPRITE_SIZE * gameScale, 'blank').scaleX = .5 + gameScale;
    winnerBlocks.create((parapetPositionX + 13.5) * SPRITE_SIZE * gameScale, parapetPositionY * SPRITE_SIZE * gameScale, 'blank').scaleX = .5 + gameScale;
    // Starting point for Frogger
    let spritePositionHz = GAME_WIDTH * gameScale / 2;
    let spritePositionV = GAME_HEIGHT * gameScale - (SPRITE_SIZE * gameScale * 1.5);
    // Place the froggo.
    player = this.physics.add.sprite(spritePositionHz, spritePositionV , 'frogger_spritesheet');
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'ahead',
        frames: this.anims.generateFrameNumbers('frogger_spritesheet', {start: 1, end: 2}),
        frameRate: 15,
        repeat: 1
    });

    player.setScale(gameScale);
    // Set the colliders.
    this.physics.add.collider(player, parapets, deadFroggo, null, this);
    this.physics.add.overlap(player, winnerBlocks, winFroggo, null, this);
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
            console.log(player.x, player.y);
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
            console.log(player.x, player.y);
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
            console.log(player.x, player.y);
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
            console.log(player.x, player.y);
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

function winFroggo(player, winBlock) {
    player.setTint(0xffcc00);
}