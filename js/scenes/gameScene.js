//import {CustomPipeline} from './scenes/customPipeline.js';
// create a new scene
let gameScene = new Phaser.Scene('MainGame');

gameScene.init = function (data) {

    this.puzzleIndex = data[0].puzzleIndex;
    this.puzzleData = data[0].puzzleData;

    this.dropSound = data[1].audio.audio.key;
    this.pickSound = data[1].audio.audio2.key;
    this.wrongSound = data[1].audio.audio3.key;
    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;
    this.scale = this.puzzleData.puzzleSettings[this.puzzleIndex].puzzleScale;
    this.range = this.puzzleData.puzzleSettings[this.puzzleIndex].puzzlePieceRange;
    this.alphaValue = 0.15;
    this.columnsNo = this.puzzleData.puzzleSettings[this.puzzleIndex].gridSizeX;
    this.rowsNo = this.puzzleData.puzzleSettings[this.puzzleIndex].gridSizeY;
    this.pieceFitterSize = this.puzzleData.puzzleSettings[this.puzzleIndex].puzzlePieceFitterSize;    

    this.pieceScale = 0.5;
}

gameScene.preload = function () {

    this.load.plugin('rexcutjigsawimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcutjigsawimageplugin.min.js', true);
    this.load.image('mainImage', this.puzzleData.puzzleSettings[this.puzzleIndex].puzzleImage);
    this.load.image('BG', 'https://t3.ftcdn.net/jpg/02/09/96/68/360_F_209966863_9WvdTvQAMpqQuFSil6hokJecoY4V1j60.jpg');
    //this.load.glsl('BnWShader', 'assets/shaders/BnWShader.frag');    
}

gameScene.create = function () {
    //console.log(this.puzzleData.puzzleSettings[0].puzzleName);
    //let BG = this.add.image(0, 0, 'BG').setOrigin(0).setScale(1.6, 1.5);
    //follow pointer when dragging
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        if (!gameObject.isMovable) {
            return;
        }
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    //setup puzzle
    this.setUpPuzzle();

}

//set up puzzle
gameScene.setUpPuzzle = function () {
    let sourceImage = this.add.image(this.gameW / 2, this.gameH / 2, 'mainImage').setVisible(false).setOrigin(0.5);
    sourceImage.setScale(this.scale);

    let bwImage = this.add.sprite(this.gameW / 2, this.gameH / 2, 'mainImage').setVisible(true).setOrigin(0.5);
    bwImage.setScale(this.scale);
    bwImage.setAlpha(this.alphaValue);
    bwImage.setVisible(true);
    bwImage.setTint(0x696764);
    console.log(sourceImage.width);

    //-----blank canvas------
    let contentHolder = this.add.graphics();
    contentHolder.fillStyle(0x000033, 1);
    contentHolder.fillRect(0, 0, sourceImage.width * (this.scale), sourceImage.height * (this.scale));
    let centerX = sourceImage.x - (sourceImage.width * this.scale) / 2;
    let centerY = sourceImage.y - (sourceImage.height * this.scale) / 2;
    contentHolder.setPosition(centerX, centerY);
    contentHolder.setVisible(false);

    this.pieces = this.plugins.get('rexcutjigsawimageplugin').gridCut(sourceImage, {
        piecesKey: 'pieces',
        columns: this.columnsNo, rows: this.rowsNo,
        edgeWidth: this.pieceFitterSize, edgeHeight: this.pieceFitterSize
    });

    // Calculate the total width available for placing the pieces
    const totalWidth = this.gameW;

    // Calculate the width of each piece based on the total width and number of pieces
    const pieceWidth = totalWidth / this.pieces.length;

    // Initialize the x position for the first piece
    let xPos = 15;

    this.originalPositions = [];

    this.unsortedPieces = this.add.group();

    for (var i = 0, cnt = this.pieces.length; i < cnt; i++) {
        let piece = this.pieces[i];
        piece.postFX.setPadding(2);
        piece.postFX.addGlow(0xffffff, 1, 0);
        piece.setInteractive();        
        this.input.setDraggable(piece);

        //piece.x += this.puzzlePieceOffset;
        //piece.y += this.puzzlePieceOffset;

        // Store the original position of the piece
        this.originalPositions.push({ index: i, x: piece.x, y: piece.y });        
                
        //shuffle pieces
        this.originalScale = piece.scale;
        let jumbledFactor = 50;
        let offset = 80;
        let random = Phaser.Math.Between(0, 100) / 100;
        if (random > 0.5) {
            offset = 100;
        }
        else {
            offset = this.gameW - 100;
        }
        let jumbledX = offset + Phaser.Math.Between(-jumbledFactor, jumbledFactor);
        let jumbledY = Phaser.Math.Between(80, this.gameH - 80);
        piece.setPosition(jumbledX, jumbledY);
        //piece.setPosition(xPos, this.gameH - 50);
        piece.setScale(this.pieceScale);
        xPos += pieceWidth;

        this.unsortedPieces.add(piece);
        piece.isMovable = true;

        piece.setAlpha(1);
    };

    // shuffle the positions of each piece horizontally to randomize without repeating
    for (let i = this.pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.pieces[i].x, this.pieces[j].x] = [this.pieces[j].x, this.pieces[i].x];
    }

    //add on drag start params
    for (let i = 0; i < this.pieces.length; i++) {
        this.pieces[i].on('dragstart', function (pointer, gameObject, dragX, dragY) {
            if (!this.pieces[i].isMovable) {
                return;
            }
            this.startXPos = this.pieces[i].x;
            this.startYPos = this.pieces[i].y;
            this.pieces[i].setDepth(2);
            this.pieces[i].setScale(this.originalScale)
            this.sound.play(this.pickSound);
        }, this);
    }
    //add on drag release handler
    for (let i = 0; i < this.pieces.length; i++) {
        this.pieces[i].on('dragend', function (pointer, gameObject, event) {
            if (!this.pieces[i].isMovable) {
                return;
            }
            this.pieces[i].setDepth(0);
            this.checkPiece(this.pieces[i], i);
        }, this);
    }
}

//Check if piece is dropped in the right place
gameScene.checkPiece = function (piece, index) {
    let originalPosition = this.originalPositions[index];
    //check if position is within a certain range
    //EASY MODE
    // if(Math.abs(piece.x - originalPosition.x) < 5 && Math.abs(piece.y - originalPosition.y) < 5) {
    //     console.log('Correct position!');
    // }
    // else {
    //     console.log('Not correct position!');
    //     piece.x = originalPosition.x;
    //     piece.y = originalPosition.y;
    // }

    //Piece checking functionality
    if ((piece.x <= originalPosition.x + this.range && piece.x >= originalPosition.x - this.range) &&
        (piece.y <= originalPosition.y + this.range && piece.y >= originalPosition.y - this.range)) {
        //console.log('Correct position!');
        piece.x = originalPosition.x;
        piece.y = originalPosition.y;
        piece.isMovable = false;

        piece.postFX.addGlow(0xffffff, 1, 0);

        disableAndEnableFX(piece, 250);

        this.sound.play(this.dropSound);


        //remove piece from this.unsortedPieces
        this.unsortedPieces.remove(piece);
        //console.log(this.unsortedPieces.getChildren().length);

        if (this.unsortedPieces.getChildren().length == 0) {
            
            setTimeout(function () {
                for (let i = 0; i < this.pieces.length; i++) {
                    this.pieces[i].postFX.enable();
                    disableAndEnableFX(this.pieces[i], 250);
                }
            }.bind(this), 1000);

            setTimeout(function () {
                this.scene.start('Menu');
            }.bind(this), 2500);
        }
    }
    else {
        //console.log('Not correct position!');
        piece.x = this.startXPos;
        piece.y = this.startYPos;
        piece.setScale(this.pieceScale);

        this.sound.play(this.wrongSound);
    }
};

this.endGame = function () {

    
};

this.disableAndEnableFX = async function (piece, delay) {
    await new Promise(resolve => setTimeout(resolve, delay));
    piece.postFX.disable();
    await new Promise(resolve => setTimeout(resolve, delay));
    piece.postFX.enable();
    await new Promise(resolve => setTimeout(resolve, delay));
    piece.postFX.disable();
};