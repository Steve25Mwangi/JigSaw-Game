let puzzleGame = new Phaser.Scene('PuzzleGame');

puzzleGame.init = function (data) {

    this.image = data[0].image;
    this.difficulty = data[0].difficulty;
    this.category = data[0].category;

    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;
    this.scale = 0.6;
    this.alphaValue = 0.5;
    this.pieceScale = 0.35;
    this.range = 50;
    this.puzzlePieceOffset = 20;

    this.platform = this.sys.game.device.os.desktop ? 'pc' : 'mobile';

    this.timeLimit = 30;

    this.textConfig = {
        font: '24px Arial',
        fill: '#ffffff'
    };
};

puzzleGame.preload = function () {

    //this.load.image('mainImage', this.image);
}

puzzleGame.create = function () {

    this.dropSound = 'drop';
    this.pickSound = 'pick';
    this.wrongSound = 'wrong';

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        if (!gameObject.isMovable) {
            return;
        }
        
        // Define a delay factor (between 0 and 1) to control the dragging speed
        var delayFactor = 1; // Adjust this value to your preference
        
        // Calculate the new position with a slight delay
        var newX = gameObject.x + (dragX - gameObject.x) * delayFactor;
        var newY = gameObject.y + (dragY - gameObject.y) * delayFactor;
        
        // Update the gameObject position
        gameObject.x = newX;
        gameObject.y = newY;
    });

    //setup puzzle
    this.setUpPuzzle();

    //this.setTimer();

    ///////endgame graphic////////

    this.endGameGroup = this.add.group();

    this.endGameGraphic = this.add.graphics();

    this.endGameGraphic.fillStyle(0x000000, 1);
    this.endGameGraphic.fillRect(this.gameW / 2 - 350, this.gameH / 2 - 175, this.gameW / 2 + 200, this.gameH / 2 + 150);
    this.endGameGraphic.setDepth(1);
    this.endGameGraphic.setAlpha(0.5);

    this.buttonBack = this.add.sprite(this.gameW / 2, this.gameH / 2 + 200, 'button').setInteractive();
    this.buttonBack.on('pointerdown', function () {
        this.scene.start('Category', this.category);
    }, this);
    this.buttonBack.setDepth(2);
    this.buttonBack.setScale(2.5, 1.5);


    this.backButtonText = this.add.text(this.buttonBack.x, this.buttonBack.y, 'Back', this.textConfig).setOrigin(0.5);
    this.backButtonText.setDepth(3);


    this.endGameText = this.add.text(this.gameW / 2, this.gameH / 2, 'Game Over', this.textConfig).setOrigin(0.5);
    this.endGameText.setDepth(3);


    this.endGameGroup.add(this.endGameGraphic);
    this.endGameGroup.add(this.buttonBack);
    this.endGameGroup.add(this.backButtonText);
    this.endGameGroup.add(this.endGameText);

    this.endGameGroup.setVisible(false);
}

puzzleGame.setTimer = function () {


    this.countdownText = this.add.text(this.gameW / 2, this.gameH / 2 - 200, 'Countdown: ' + this.timeLimit, this.textConfig).setOrigin(0.5);

    this.timerEvent = this.time.addEvent({
        delay: 1000,
        callback: function () {

            this.countdownText.setText('Countdown: ' + (this.timerEvent.repeatCount - 1));

            // Check if the countdown has finished
            if (this.timerEvent.repeatCount === 0) {
                // Stop the timer and display a message
                this.timerEvent.remove();
                this.countdownText.setText('Timed out!');
                this.loseGame();
            }
        },
        callbackScope: this,
        repeat: this.timeLimit
    });
}

puzzleGame.setUpPuzzle = function () {
    let sourceImage = this.add.image(this.gameW / 2, this.gameH / 2, this.image).setVisible(false).setOrigin(0.5);
    sourceImage.setScale(this.scale);

    let bwImage = this.add.sprite(this.gameW / 2, this.gameH / 2, this.image).setVisible(true).setOrigin(0.5);
    bwImage.setScale(this.scale);
    bwImage.setAlpha(this.alphaValue);
    bwImage.setVisible(false);
    bwImage.setTint(0x696764);


    //-----blank canvas------
    let contentHolder = this.add.graphics();
    contentHolder.fillStyle(0x000033, 1);
    contentHolder.fillRect(0, 0, sourceImage.width * (this.scale), sourceImage.height * (this.scale));
    let centerX = sourceImage.x - (sourceImage.width * this.scale) / 2;
    let centerY = sourceImage.y - (sourceImage.height * this.scale) / 2;
    contentHolder.setPosition(centerX, centerY);
    contentHolder.setVisible(false);

    const difficultyMap = {
        'easy': { columns: 3, rows: 3, pieceSize: 50, timeLimit: 120, pieceOffset: 20},
        'medium': { columns: 4, rows: 4, pieceSize: 20, timeLimit: 90, pieceOffset: 10 },
        'hard': { columns: 5, rows: 5, pieceSize: 20, timeLimit: 60, pieceOffset: 10 }
    };

    if (difficultyMap[this.difficulty]) {
        const { columns, rows, pieceSize, timeLimit, pieceOffset } = difficultyMap[this.difficulty];
        this.columnsNo = columns;
        this.rowsNo = rows;
        this.pieceFitterSize = pieceSize;
        this.timeLimit = timeLimit;
        this.puzzlePieceOffset = pieceOffset;
    }

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
        //if (this.platform == 'pc') {
            piece.preFX.setPadding(2);
            piece.preFX.addGlow(0xffffff, 1, 0);
            piece.preFX.addShadow(0, 0, 0.006, 2, 0x333333, 10);
        //}
        piece.setInteractive();
        this.input.setDraggable(piece);

        piece.x += this.puzzlePieceOffset;
        piece.y += this.puzzlePieceOffset;

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

        //debugging
        //piece.setAlpha(this.alphaValue);
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
            
            //play scale tween on piece
            //add a tween scale animation to piece
            this.scaleTween = this.tweens.add({
                targets: this.pieces[i],
                scale: this.originalScale,
                duration: 225,
                ease: 'Bounce.Out',
                callbackScope: this
            });

            console.log('Tweening!!' + this.pieces[i]);
            this.startXPos = this.pieces[i].x;
            this.startYPos = this.pieces[i].y;
            this.pieces[i].setDepth(2);
            //this.pieces[i].setScale(this.originalScale)
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
puzzleGame.checkPiece = function (piece, index) {
    let originalPosition = this.originalPositions[index];

    //Piece checking functionality
    if ((piece.x <= originalPosition.x + this.range && piece.x >= originalPosition.x - this.range) &&
        (piece.y <= originalPosition.y + this.range && piece.y >= originalPosition.y - this.range)) {
        //console.log('Correct position!');
        piece.x = originalPosition.x;
        piece.y = originalPosition.y;
        piece.isMovable = false;

        if (this.platform == 'pc') {
            piece.preFX.addGlow(0xffffff, 1, 0);

            disableAndEnableFX(piece, 250);
        }
        else {
            mobileFX(piece, 250);
        }

        this.sound.play(this.dropSound);


        //remove piece from this.unsortedPieces
        this.unsortedPieces.remove(piece);
        //console.log(this.unsortedPieces.getChildren().length);

        if (this.unsortedPieces.getChildren().length == 0) {
            this.endGame();
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

puzzleGame.endGame = function () {

    if (this.timerEvent) {
        this.timerEvent.remove();
    }

    //this.countdownText.setText('Well Done!');

    setTimeout(function () {
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.platform == 'pc') {
                this.pieces[i].preFX.enable();
                disableAndEnableFX(this.pieces[i], 250);
            }
            else {
                mobileFX(this.pieces[i], 250);
            }

        }
    }.bind(this), 1000);


    setTimeout(function () {
        this.endGameText.setText('Well Done!');
        this.endGameGroup.setVisible(true);
        //this.scene.start('PuzzleMenu', this.category);
    }.bind(this), 2500);
};

puzzleGame.loseGame = function () {

    this.endGameText.setText('Game Over!');
    this.endGameGroup.setVisible(true);
};

this.disableAndEnableFX = async function (piece, delay) {
    await new Promise(resolve => setTimeout(resolve, delay));
    piece.preFX.disable();
    await new Promise(resolve => setTimeout(resolve, delay));
    piece.preFX.enable();
    await new Promise(resolve => setTimeout(resolve, delay));
    piece.preFX.disable();
};

this.mobileFX = async function (piece, delay) {
    let color = 0xffcc00;
    await new Promise(resolve => setTimeout(resolve, delay));
    piece.setTint(color);
    await new Promise(resolve => setTimeout(resolve, delay));
    piece.clearTint();
    await new Promise(resolve => setTimeout(resolve, delay));
    piece.setTint(color);
    await new Promise(resolve => setTimeout(resolve, delay));
    piece.clearTint();
}