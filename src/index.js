import Game from "./scenes/game.js";
const config = {
  width: 600,
  height: 600,
  physics: {
    default: 'matter',
    matter: {
      debug: true
    }
  },
  scene: [Game]
};

new Phaser.Game(config);