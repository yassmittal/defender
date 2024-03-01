class Game extends Phaser.Scene {
  constructor() {
    super('game')
  }

  preload() {
    this.load.atlas("penguin", "../assets/Penguin/penguin.png", "../assets/Penguin/penguin.json")
    this.load.image('tiles', "../assets/Tile/sheet.png")
    this.load.tilemapTiledJSON('tilemap', "../assets/Tile/game.json")
  }

  create() {
    // this.add.image(200, 300, 'penguin', "penguin_die03.png")

    const map = this.make.tilemap({
      key: "tilemap"
    })

    const tileset = map.addTilesetImage("icemap", "tiles")

    const ground = map.createLayer('ground', tileset);

    ground.setCollisionByProperty({ collides: true })

    this.matter.world.convertTilemapLayer(ground)

    const { width, height } = this.scale;

    this.penguin = this.matter.add.sprite(width / 2, height / 2, "penguin");
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
      this.penguin.anims.play('walk', true);
    }
    else {
      this.penguin.setVelocityX(0);
      this.penguin.anims.play('idle');
    }

    // if (cursors.up.isDown && this.penguin.body.touching.down) {
    //   this.penguin.setVelocityY(-3);
    // }


  }
}

export default Game;