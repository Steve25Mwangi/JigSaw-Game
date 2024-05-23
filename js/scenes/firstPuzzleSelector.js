let firstPuzzleSelector = new Phaser.Scene('FirstPuzzleSelector');

firstPuzzleSelector.init = function () {
    this.puzzleData = this.cache.json.get('puzzleData'); 
    this.categoryLength = this.puzzleData.categories.length;
}

firstPuzzleSelector.preload = function () {
    //load ipuzzle image
    //this.load.image('puzzleOutline', 'assets/images/jigsawOutline.png');
}

firstPuzzleSelector.create = function () {

    this.createImage();

    this.createUI();

    this.endGameGraphic = this.add.graphics();

    this.endGameGraphic.fillStyle(0x000000, 1);
    this.endGameGraphic.fillRect(this.randomPuzzleImage.x - 245, this.randomPuzzleImage.y - 175, this.randomPuzzleImage.width * 0.7, this.randomPuzzleImage.height *0.7);    
    this.endGameGraphic.setAlpha(0.5);
    this.endGameGraphic.setDepth(-1);
    
    //on mouse click anywhere start switchPuzzle
    //this.input.on('pointerdown', switchPuzzle);

}

firstPuzzleSelector.createImage = function () {

    if (!this.randomPuzzleImage) {
        console.log('Empty');
    }
    else {
        //destroy
        console.log('destroy')
        this.randomPuzzleImage.destroy();
    }

    let randomCategory = Math.floor(Math.random() * this.categoryLength);
    let randomCategoryName = this.puzzleData.categories[randomCategory].category;   

    let randomPuzzleInt = Math.floor(Math.random() * this.puzzleData.categories[randomCategory].images.length);            

    this.randomPuzzleImage = this.add.rexAlphaMaskImage(this.game.config.width/2, this.game.config.height/2, 'thumb_' + randomCategoryName + randomPuzzleInt, {
        mask: {
            key: 'puzzleOutline',
            invertAlpha: true,
            scale: 0.65,
        },

         backgroundColor: '#3d3d3d',
    })

    //randomPuzzleImage.setOrigin(0)
    this.randomPuzzleImage.setScale(0.7);
    this.randomPuzzleImage.setDepth(0);

}

firstPuzzleSelector.createUI = function () {

    let randomButton = this.add.image(this.game.config.width/2 - 150, this.game.config.height/2 + 200, 'blueBtn').setInteractive();
    randomButton.on('pointerdown', switchPuzzle);
    randomButton.setDepth(1)
    
    let btnText = this.add.text(randomButton.x, randomButton.y, 'RANDOM', { font: '28px Arial', fill: '#fff' }).setOrigin(0.5);
    btnText.setDepth(1);

    let specificButton = this.add.image(this.game.config.width/2 + 150, this.game.config.height/2 + 200, 'blueBtn').setInteractive();
    specificButton.on('pointerdown', switchScene);
    specificButton.setDepth(1)
    
    let btnText2 = this.add.text(specificButton.x, specificButton.y, 'SPECIFIC', { font: '28px Arial', fill: '#fff' }).setOrigin(0.5);
    btnText2.setDepth(1);
}

var switchPuzzle = function () {

    console.log('switchPuzzle')
    firstPuzzleSelector.createImage();

}

var switchScene = function () {
    firstPuzzleSelector.scene.start('SpecificPuzzleSelector');
}