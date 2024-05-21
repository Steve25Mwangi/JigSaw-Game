let puzzleSetup = new Phaser.Scene('PuzzleSetup');


puzzleSetup.init = function (data) {
    this.image = data[0].puzzleImage;
    this.category = data[0].category;   

    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;
}

puzzleSetup.create = function () {

    this.cameras.main.fadeIn(500);
    let sourceImage = this.add.image(this.gameW / 2, this.gameH / 2 - 60, this.image).setVisible(false).setOrigin(0.5);
    sourceImage.setScale(0.5);

    this.pieces = this.plugins.get('rexcutjigsawimageplugin').gridCut(sourceImage, {
        piecesKey: 'pieces',
        columns: 8, rows: 8,
        edgeWidth: 15, edgeHeight: 15
    });

    //////////////////
    for (var i = 0, cnt = this.pieces.length; i < cnt; i++) {
        let piece = this.pieces[i];

        piece.preFX.setPadding(2);
        piece.preFX.addGlow(0xffffff, 1, 0);
        piece.preFX.addShadow(0x000000, 4, 4, 3, 3);        

    };
    let textConfig = {
        font: '24px Arial',
        fill: '#ffffff',
        setOrigin: 0.5
    };
    let image = this.image;

    let easyBtn = this.add.image(160, 450, 'button').setScale(2, 1.25);
    let smallBtnText = this.add.text(easyBtn.x, easyBtn.y, 'Easy', textConfig).setOrigin(0.5);
    easyBtn.setInteractive();
    easyBtn.on('pointerdown', () => {          
        this.scene.start('PuzzleGame', [{ 'image': this.image, 'difficulty': 'easy', 'category': this.category }]);        
    });

    let mediumBtn = this.add.image(160 + 300, 450, 'button').setScale(2, 1.25);
    let mediumBtnText = this.add.text(mediumBtn.x, mediumBtn.y, 'Medium', textConfig).setOrigin(0.5);
    mediumBtn.setInteractive();
    mediumBtn.on('pointerdown', () => {
        this.scene.start('PuzzleGame', [{ 'image': this.image, 'difficulty': 'medium', 'category': this.category }]);        
    });

    let hardBtn = this.add.image(160 + 600, 450, 'button').setScale(2, 1.25);
    let hardBtnText = this.add.text(hardBtn.x, hardBtn.y, 'Hard', textConfig).setOrigin(0.5);
    hardBtn.setInteractive();
    hardBtn.on('pointerdown', () => {
        this.scene.start('PuzzleGame', [{ 'image': this.image, 'difficulty': 'hard', 'category': this.category }]);
        
    });
}