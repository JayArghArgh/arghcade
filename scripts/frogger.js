var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

var player;
var bombs;
var stars;
var platforms;
var cursors;
var score = 0;
var scoreText;

var game = new Phaser.Game(config);

function preload () {
    this.load.image('frogger_bg', 'assets/frogger/frogger_bg.png');
    // this.load.image('ground', 'assets/platform.png');
    // this.load.image('star', 'assets/star.png');
    // this.load.image('bomb', 'assets/bomb.png');
    // this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48});
}

function create ()
{
    bgImage = this.add.image(400, 300, 'frogger_bg');
    bgImage.setScale(2);
    // 224 256
}

function update ()
{
}
