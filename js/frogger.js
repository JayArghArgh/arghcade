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
            // gravity: { y: 300 },
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
    cursors = this.input.keyboard.createCursorKeys();

    // let rectangleBase = this.add.rectangle(200, 400, 148, 148, 0xff6699);
    // let rect1 = this.add.rectangle(50, availableHt - 50, availableW, 50, 0x37c3be);
    // this.physics.add.existing(rect1);


    player = this.physics.add.sprite(availableW / 2, availableHt - SPRITE_SIZE * gameScale * 1.5, 'frogger_spritesheet');
    // 224 256
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'ahead',
        frames: this.anims.generateFrameNumbers('frogger_spritesheet', {start: 0, end: 2}),
        frameRate: 5,
        repeat: 1
    });
    player.setScale(gameScale);

    // this.physics.add.collider(player, rect1);

}

function update () {
    if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
        player.setY(player.y - (SPRITE_SIZE * gameScale));
        // player.setVelocityY(-160);
        player.anims.play('ahead', true);
    } else if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
        player.setX(player.x - (SPRITE_SIZE * gameScale));
    } else if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
        player.setX(player.x + (SPRITE_SIZE * gameScale));
    }  else if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
        player.setY(player.y + (SPRITE_SIZE * gameScale));
    };

        //
        // if (Phaser.Input.Keyboard.JustDown(spacebar))
        // {
        //     var bullet = bullets.get();
        //
        //     if (bullet)
        //     {
        //         bullet.fire(ship.x, ship.y);
        //     }
        // }

}