let availableHt = window.screen.availHeight;
let availableW = window.screen.availWidth;

var config = {
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

var game = new Phaser.Game(config);

function preload () {
    this.load.image('frogger_bg', 'assets/frogger/frogger_bg.png');
}

function create ()
{
    bgImage = this.add.image(availableW / 2, availableHt / 2, 'frogger_bg');
    bgImage.setScale(availableHt / 256);
    // 224 256
}

function update ()
{
}
