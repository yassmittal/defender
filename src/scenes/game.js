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

    this.cursors = this.input.keyboard.createCursorKeys();

    this.isTouchingGround = false;
    this.coin;

    const map = this.make.tilemap({
      key: "tilemap"
    })

    this.matter.world.setBounds(0, 0, 1840, 1600)

    const tileset = map.addTilesetImage("icemap", "tiles")

    const ground = map.createLayer('ground', tileset);
    ground.setCollisionByProperty({ collides: true })

    const objectsLayer = map.getObjectLayer('objects')


    const { width, height } = this.scale;



    this.monster = this.matter.add.sprite(width / 2, height / 2, "monster").setScale(0.2);

    // this.physics.matter.add.overlap(this.penguin, this.monster, () => { console.log() }, null, this);
    // this.physics.world.enable(coin);

    // this.physics.add.collider(this.penguin, this.monster, function (sprite, body) {
    //   // Collision logic
    //   console.log('Collision occurred between sprite and Matter.js body');
    // });ump



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
      frameRate: 10,
      repeat: 0,
      loop: true
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








    objectsLayer.objects.forEach(objData => {
      const { x = 0, y = 0, name, width = 0, height = 0 } = objData

      this.penguin;

      switch (name) {
        case "penguin-spawn":
          {
            this.penguin = this.matter.add.sprite(x + width / 2, y, "penguin")
              .play('idle')
              .setFixedRotation()

            this.penguin.setOnCollide(() => {
              this.isTouchingGround = true;
            })

            this.cameras.main.startFollow(this.penguin)
            break;
          }

        case "coin": {
          this.coin = this.matter.add.sprite(x + width / 2, y + height / 2, "coin")
            .setStatic(true)
            .anims.play('rotate-coin', true)
            .isSensor(true)

          this.matter.world.on('collisionstart', (event) => {
            console.log(event.pairs)
            event.pairs.forEach(pair => {
              const { bodyA, bodyB } = pair;
              if ((bodyA === this.penguin.body && bodyB === this.coin.body) ||
                (bodyA === this.coin.body && bodyB === this.penguin.body)) {
                this.coin.destroy();
              }
            });
          });

        }
      }

    })


    this.matter.world.convertTilemapLayer(ground)

  }


  update() {


    if (this.cursors.left.isDown) {
      this.penguin.setVelocityX(-6);
      this.penguin.flipX = true;
      this.penguin.anims.play('walk', true);
    }
    else if (this.cursors.right.isDown) {
      this.penguin.setVelocityX(6);
      this.penguin.flipX = false;
      this.penguin.anims.play('walk', true);
    }
    else {
      this.penguin.setVelocityX(0);
      this.penguin.anims.play('idle');
    }

    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)

    if (spaceJustPressed && this.isTouchingGround === true) {
      this.penguin.setVelocityY(-12);
      this.isTouchingGround = false;
      // this.penguin.flipX = false;
    }

    // else if (cursors.up.isDown) {

    //   this.penguin.setVelocityY(-6);
    //   this.penguin.flipX = false;
    //   this.penguin.anims.play('jump', true);
    //   // this.penguin.anims.play('walk', true);
    // }
    // const spaceJustPressed = Phaser.Input.keyboard.

    // if (cursors.up.isDown && this.penguin.body.touching.down) {
    //   this.penguin.setVelocityY(-3);
    // }


  }
}

export default Game;