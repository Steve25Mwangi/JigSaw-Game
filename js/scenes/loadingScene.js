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
    bgBar.setPosition(this.gameW / 2 - barW / 2, this.gameH / 2 - barH / 2);
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
    this.load.plugin('rexalphamaskimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexalphamaskimageplugin.min.js', true);

    this.load.image('button', 'assets/images/button.png');
    //assets      

    this.load.audio('drop', 'assets/audio/DropPiece.wav');
    this.load.audio('pick', 'assets/audio/PickPiece.wav');
    this.load.audio('wrong', 'assets/audio/WrongSfx.wav');

    this.puzzleData = this.cache.json.get('puzzleData');

    let categoryLength = this.puzzleData.categories.length;

    this.load.image('puzzleOutline', 'assets/images/jigsawOutline.png');

    this.load.image('blueBtn', 'assets/images/blue_button00.png');
    //load all images
    for (let i = 0; i < categoryLength; i++) {
        let categoryName = this.puzzleData.categories[i].category;
        let imageLength = this.puzzleData.categories[i].images.length;
        for (let j = 0; j < imageLength; j++) {
            if (this.textures.exists('thumb_' + categoryName + j)) {
                console.log('Exists')
                return;
            }
            //console.log('thumb_' + categoryName + j);
            this.load.image('thumb_' + categoryName + j, this.puzzleData.categories[i].images[j].puzzleImage);
        }
    }

    this.load.image('animBtn', 'assets/images/animBtn.png');
    this.load.image('carsBtn', 'assets/images/carsBtn.png');
    this.load.image('natureBtn', 'assets/images/natureBtn.png');
    this.load.image('placesBtn', 'assets/images/placesBtn.png');
    this.load.image('techBtn', 'assets/images/techBtn.png');
    this.load.image('underwaterBtn', 'assets/images/underwaterBtn.png');

    //TESTING!
    // for (let i = 0; i < 50; i++){
    //     this.load.image('test' + i, 'assets/images/parrot.png');
    // }
};

// executed once, after assets were loaded
loadingScene.create = function () {

    this.scene.start('SpecificPuzzleSelector');

};