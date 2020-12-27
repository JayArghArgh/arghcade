const GAME_SIZE = 256;
const SPRITE_SIZE = 16;
let availableHt = window.screen.availHeight;
let availableW = window.screen.availWidth;
let gameScale = availableHt / GAME_SIZE;

let config = {
    type: Phaser.AUTO,
    parent: 'arghcade',
    width: availableW,
    height: availableHt,
    // width: 560,
    // height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
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

function preload () {
    this.load.image('frogger_bg', 'assets/frogger/frogger_bg.png');
    this.load.spritesheet(
        'frogger_spritesheet',
        'assets/frogger/frogger_spritesheet.png',
        {frameWidth: SPRITE_SIZE, frameHeight: SPRITE_SIZE}
        );
}

function create ()
{
    bgImage = this.add.image(availableW / 2, availableHt / 2, 'frogger_bg');
    bgImage.setScale(gameScale);

    player = this.add.sprite(availableW / 2, availableHt - SPRITE_SIZE * gameScale * 1.5, 'frogger_spritesheet');
    // 224 256
    this.anims.create({
        key: 'ahead',
        frames: [{key: 'frogger_spritesheet', frame: 3}],
        frameRate: 20
    });
    player.setScale(gameScale);

}

function update ()
{
}
