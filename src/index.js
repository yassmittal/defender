import Game from "./scenes/game.js";
const config = {
  width: 600,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: [Game]
};

new Phaser.Game(config);