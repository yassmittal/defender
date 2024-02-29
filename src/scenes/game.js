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
    this.add.image(200, 300, 'penguin', "penguin_die03.png")

    const map = this.make.tilemap({
      key: "tilemap"
    })

    const tileset = map.addTilesetImage("icemap", "tiles")

    map.createLayer('ground', tileset);

    this.cameras.main.scrollY = 400;
  }

  update() {
  }
}

export default Game;