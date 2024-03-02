class Game extends Phaser.Scene {
  constructor() {
    super('game')
  }

  preload() {
    this.load.atlas("penguin", "../assets/Penguin/penguin.png", "../assets/Penguin/penguin.json");
    this.load.atlas("coin", "../assets/coin/coin.png", "../assets/coin/coin.json");
    this.load.atlas("monster", "../assets/miniMonster/miniMonster.png", "../assets/miniMonster/miniMonster.json");

    this.load.image('tiles', "../assets/Tile/sheet.png")
    this.load.tilemapTiledJSON('tilemap', "../assets/Tile/game.json")
  }

  create() {
    // this.add.image(200, 300, 'penguin', "penguin_die03.png")

    const map = this.make.tilemap({
      key: "tilemap"
    })

    this.matter.world.setBounds(0, 0, 1840, 1600)

    const tileset = map.addTilesetImage("icemap", "tiles")

    const ground = map.createLayer('ground', tileset);

    ground.setCollisionByProperty({ collides: true })

    this.matter.world.convertTilemapLayer(ground)

    const { width, height } = this.scale;

    this.coin = this.add.sprite(100, 700 / 2, "coin");


    this.penguin = this.matter.add.sprite(500, 300 / 2, "penguin");
    this.monster = this.matter.add.sprite(width / 2, height / 2, "monster").setScale(0.2);

    // this.physics.matter.add.overlap(this.penguin, this.monster, () => { console.log() }, null, this);
    // this.physics.world.enable(coin);

    // this.physics.add.collider(this.penguin, this.monster, function (sprite, body) {
    //   // Collision logic
    //   console.log('Collision occurred between sprite and Matter.js body');
    // });



    this.anims.create({
      key: "rotate-coin",
      frames: this.anims.generateFrameNames("coin", {
        start: "1",
        end: "6",
        prefix: "gold_coin_round_star_",
        suffix: ".png"
      }),
      frameRate: 8,
      repeat: -1,
    })

    let monsterLeftAnims = this.anims.create({
      key: "monster-left",
      frames: this.anims.generateFrameNames("monster", {
        start: "1",
        end: "2",
        prefix: "monster02_walk_0",
        suffix: "_left.png"
      }),
      frameRate: 8,
      repeat: 0,
    })

    this.anims.create({
      key: "monster-right",
      frames: this.anims.generateFrameNames("monster", {
        start: "1",
        end: "2",
        prefix: "monster02_walk_0",
        suffix: ".png"
      }),
      frameRate: 8,
      repeat: 0,
    })

    this.anims.create({
      key: "monster-idle",
      frames: [
        { key: "monster", frame: "monster02_idle.png" },
        { key: "monster", frame: "monster02_idle_blink.png" },
        { key: "monster", frame: "monster02_idle_left.png" }
      ],
      frameRate: 3,
      repeat: 0,
    })

    this.monster.anims.play('monster-idle', true)

    function playAnimationSequence(monster) {
      monster.on('animationcomplete', function (animation) {
        if (animation.key === "monster-idle") {
          monster.play("monster-left", true);
        } else if (animation.key === "monster-left") {
          monster.play("monster-idle", true);
        } else if (animation.key === "monster-right") {
          monster.play("monster-idle", true);
        }
      });
    }

    playAnimationSequence(this.monster);



    this.coin.anims.play('rotate-coin', true);
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNames("penguin", {
        start: "1",
        end: "4",
        prefix: "penguin_walk0",
        suffix: ".png"
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNames("penguin", {
        start: "1",
        end: "3",
        prefix: "penguin_jump0",
        suffix: ".png"
      }),
      frameRate: 6,
      repeat: -1,
    })

    this.anims.create({
      key: "slide",
      frames: this.anims.generateFrameNames("penguin", {
        start: "1",
        end: "2",
        prefix: "penguin_slide0",
        suffix: ".png"
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: "idle",
      frames: [{ key: "penguin", frame: "penguin_walk01.png" }],
    })
    this.penguin.play('idle')
    this.penguin.setFixedRotation();

    this.cameras.main.startFollow(this.penguin)

  }

  update() {
    let cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.penguin.setVelocityX(-6);
      this.penguin.flipX = true;
      this.penguin.anims.play('walk', true);
    }
    else if (cursors.right.isDown) {
      this.penguin.setVelocityX(6);
      this.penguin.flipX = false;
      this.penguin.anims.play('slide', true);
    }
    else if (cursors.up.isDown) {

      this.penguin.setVelocityY(-6);
      this.penguin.flipX = false;
      this.penguin.anims.play('jump', true);
      // this.penguin.anims.play('walk', true);
    }
    else {
      this.penguin.setVelocityX(0);
      this.penguin.anims.play('idle');
    }

    // const spaceJustPressed = Phaser.Input.keyboard.

    // if (cursors.up.isDown && this.penguin.body.touching.down) {
    //   this.penguin.setVelocityY(-3);
    // }


  }
}

export default Game;