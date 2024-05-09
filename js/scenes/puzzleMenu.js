let puzzleMenu = new Phaser.Scene('PuzzleMenu');

puzzleMenu.init = function (data) {    
    this.category = data;
     //get json data
     this.puzzleData = this.cache.json.get('puzzleData');

    this.categoryInt = {
        'animal': 0,
        'cars': 1,
        'nature': 2,
        'places': 3,
        'technology': 4,
        'underwater': 5
    }[data] || 0;   

    this.imageLength = this.puzzleData.categories[this.categoryInt].images.length;    
}

puzzleMenu.preload = function () {

   
    for (let i = 0; i < this.imageLength; i++) {
        if (this.textures.exists('thumb_' + this.category + i)) {
            console.log('Exists')
            return;
        }
        
        this.load.image('thumb_' + this.category + i, this.puzzleData.categories[this.categoryInt].images[i].puzzleImage);
    }
}

puzzleMenu.create = function () {


    this.cameras.main.fadeIn(1000);

    this.createMenu();

    this.buttonBack = this.add.sprite(600 + 200, 50, 'button').setInteractive();
    this.buttonBack.on('pointerdown', function () {
        this.scene.stop();
        this.scene.start('Category');

    }, this);
    this.buttonBack.setDepth(2);
    this.buttonBack.setScale(2, 1);
}

puzzleMenu.createMenu = function () {

    if (this.puzzleImageGroup == null) {
        // code to execute if puzzleImageGroup has elements
        // console.log('no clear scene');
    } else {

        //remove all elements inside this.puzzleImageGroup
        this.puzzleImageGroup.destroy();
        // console.log('clear scene');
    }
    // Define the number of rows and columns
    let rowNo = 3;
    let colNo = 3;

    let puzzleWidth = 100;
    let puzzleHeight = 2;

    let offset = 10;

    // Calculate the spacing between images
    let xSpace = (this.game.config.width - (colNo * puzzleWidth)) / (colNo + 1);
    let ySpace = (this.game.config.height - (rowNo * puzzleHeight)) / (rowNo + 1);

    // Define the starting positions
    let xStart = xSpace;
    let yStart = ySpace;

    // Loop through each puzzle setting
    for (let i = 0; i < this.imageLength; i++) {
        let rowIdx = Math.floor(i / colNo);
        let colIdx = i % colNo;

        let xPos = xStart + colIdx * (puzzleWidth + xSpace) + offset;
        let yPos = yStart + rowIdx * (puzzleHeight + ySpace) + offset;

        let puzzleImage = this.add.image(xPos, yPos, 'thumb_' + this.category + i);
        puzzleImage.setScale(Math.min(xSpace / puzzleImage.width, ySpace / puzzleImage.height));
        puzzleImage.setOrigin(0.5);        

        puzzleImage.setInteractive();
        puzzleImage.on('pointerdown', function () {            
            this.scene.start('PuzzleSetup', [{ 'puzzleImage': 'thumb_' + this.category + i, 'category': this.category }]);
        }, this);        
    }

}