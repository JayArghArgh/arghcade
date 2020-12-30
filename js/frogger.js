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
var source;
var target = new Phaser.Math.Vector2();
let allowButton = true;
// new Phaser.Game(config);

function preload () {
    this.load.image('froggo', 'assets/frogger/icon-frogger-pixel-512x512.png');
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
    // source = this.physics.add.image(100, 300, 'froggo');
    // source.setScale(0.1);
    cursors = this.input.keyboard.createCursorKeys();

    let spritePositionHz = availableW / 2;
    let spritePositionV = availableHt - ( SPRITE_SIZE * gameScale * 1.5);

    player = this.physics.add.sprite(spritePositionHz, spritePositionV , 'frogger_spritesheet');
    // 224 256
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'ahead',
        frames: this.anims.generateFrameNumbers('frogger_spritesheet', {start: 1, end: 2}),
        frameRate: 15,
        repeat: 1
    });

    this.anims.create({
        key: 'ahead_0',
        frames: [{ key: 'frogger_spritesheet', frame: 0}],
        frameRate: 20
    });

    this.anims.create({
        key: 'ahead_1',
        frames: [{ key: 'frogger_spritesheet', frame: 1}],
        frameRate: 20
    });

    this.anims.create({
        key: 'ahead_2',
        frames: [{ key: 'frogger_spritesheet', frame: 2}],
        frameRate: 20
    });


    player.anims.play('ahead_0', true);
    player.setScale(gameScale);

    // this.physics.add.collider(player, rect1);

}

function update ()
{
    if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
        if (allowButton) {
            allowButton = false;
            player.angle = 0;
            player.anims.play('ahead', true);
            target.x = player.x;
            target.y = player.y - SPRITE_SIZE * gameScale;
            this.physics.moveToObject(player, target, 200);
            console.log(player.x, player.y);
        }

    } else if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
        if (allowButton) {
            allowButton = false;
            player.angle = 180;
            player.anims.play('ahead', true);
            target.x = player.x;
            target.y = player.y + SPRITE_SIZE * gameScale;
            this.physics.moveToObject(player, target, 200);
            console.log(player.x, player.y);
        }

    } else if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
        if (allowButton) {
            allowButton = false;
            player.angle = 270;
            player.anims.play('ahead', true);
            target.x = player.x - SPRITE_SIZE * gameScale;
            target.y = player.y;
            this.physics.moveToObject(player, target, 200);
            console.log(player.x, player.y);
        }

    } else if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
        if (allowButton) {
            allowButton = false;
            player.angle = 90;
            player.anims.play('ahead', true);
            target.x = player.x + SPRITE_SIZE * gameScale;
            target.y = player.y;
            this.physics.moveToObject(player, target, 200);
            console.log(player.x, player.y);
        }

    }


    let distance = Phaser.Math.Distance.Between(player.x, player.y, target.x, target.y);

    if (player.body.speed > 0)
    {

        //  4 is our distance tolerance, i.e. how close the source can get to the target
        //  before it is considered as being there. The faster it moves, the more tolerance is required.
        if (distance < 4)
        {
            player.body.reset(target.x, target.y);
            allowButton = true;
        }
    }
}






// function update () {
//     let newPLayerY = player.y - ((SPRITE_SIZE * gameScale) / 2);
//     let newPlayerX = (SPRITE_SIZE * gameScale) / 2;
//
//
//     if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
//         player.anims.play('ahead', true);
//         player.setVelocityY(-160);
//         // this.physics.moveTo(player, player.x, newPLayerY, 300);
//
//         //
//         // this.physics.moveTo(player, player.x, player.y - (SPRITE_SIZE * gameScale), 2000);
//         // player.setY(player.y - ((SPRITE_SIZE * gameScale) / 2));
//         // player.anims.play('ahead_2', true);
//         // player.setY(player.y - ((SPRITE_SIZE * gameScale) / 2));
//         // player.anims.play('ahead_0', true);
//     } else if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
//         player.setX(player.x - (SPRITE_SIZE * gameScale));
//     } else if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
//         player.setX(player.x + (SPRITE_SIZE * gameScale));
//     }  else if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
//         player.setY(player.y + (SPRITE_SIZE * gameScale));
//     };
//
// }