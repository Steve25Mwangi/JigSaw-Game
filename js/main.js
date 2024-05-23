//import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 1920 / 2,
  height: 1080 / 2,
  backgroundColor: '#fc710e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  forceOrientation: true,
  orientation: 'landscape',
  scene: [logoScene, loadingScene, homeScene, firstPuzzleSelector, specificPuzzleSelector, categoryScene, puzzleMenu, puzzleSetup, puzzleGame, menuScene, gameScene,],
  title: 'Jigsaw Puzzle',
};



// create the game, and pass it the configuration
let game = new Phaser.Game(config);