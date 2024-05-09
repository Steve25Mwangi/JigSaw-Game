// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 1920 / 2,
  height: 1080 / 2,
  backgroundColor: '#b8b9bf',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [logoScene, loadingScene, categoryScene, puzzleMenu, puzzleSetup, puzzleGame,menuScene, gameScene,],
  title: 'Jigsaw Puzzle',
};



// create the game, and pass it the configuration
let game = new Phaser.Game(config);