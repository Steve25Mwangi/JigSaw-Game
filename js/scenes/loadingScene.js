// create a new scene
let loadingScene = new Phaser.Scene('LoadingScene');

// load asset files for our game
loadingScene.preload = function () {

    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;
    let bg = this.add.graphics();
    bg.fillStyle(0x000000, 1);
    bg.fillRect(0, 0, this.gameW, this.gameH);

    //progress bar bg
    let bgBar = this.add.graphics();
    let barW = 150;
    let barH = 30;
    bgBar.setPosition(this.gameW / 2 - barW/2, this.gameH / 2 - barH/2);
    bgBar.fillStyle(0xF5F5F5, 1);
    bgBar.fillRect(0, 0, barW, barH);

    //progress bar
    let progressBar = this.add.graphics();
    progressBar.setPosition(this.gameW / 2 - barW / 2, this.gameH / 2 - barH / 2);
    
    //listen to progress event
    this.load.on('progress', function (value) {
        //clear progress bar to draw again
        progressBar.clear();
        //set style
        progressBar.fillStyle(0x9AD98D, 1);

        //draw 
        progressBar.fillRect(0, 0, value * barW, barH);
    }, this);

    this.load.plugin('rexcutjigsawimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcutjigsawimageplugin.min.js', true);
    this.load.image('button', 'assets/images/button.png');
    //assets

    this.puzzleDataJson = this.load.json('puzzleData', 'assets/json/puzzleData.json');    

    this.load.audio('drop', 'assets/audio/DropPiece.wav');
    this.load.audio('pick', 'assets/audio/PickPiece.wav');
    this.load.audio('wrong', 'assets/audio/WrongSfx.wav');
    //load sound
    //this.sound_drop = this.load.audio('drop', 'assets/audio/DropPiece.wav');
   // this.sound_pick = this.load.audio('pick', 'assets/audio/PickPiece.wav');
   // this.sound_wrong = this.load.audio('wrong', 'assets/audio/WrongSfx.wav');


     //TESTING!
    // for (let i = 0; i < 50; i++){
    //     this.load.image('test' + i, 'assets/images/parrot.png');
    // }
};
  
// executed once, after assets were loaded
loadingScene.create = function () {
   
    this.scene.start('Category');
  
};