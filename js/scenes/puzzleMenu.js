let puzzleMenu = new Phaser.Scene('PuzzleMenu');

puzzleMenu.init = function (data) {

    this.category = data;
    //get json data
    this.puzzleData = this.cache.json.get('puzzleData');
    this.COLOR_PRIMARY = 0x4e342e;
    this.COLOR_LIGHT = 0x7b5e57;
    this.COLOR_DARK = 0x260e04;
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
    this.load.scenePlugin({
        key: 'rexuiplugin',
        url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
        sceneKey: 'rexUI'
    });

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

    //this.createMenu();
    this.createScrollObject();
    // this.createMenuTwo();

    this.buttonBack = this.add.sprite(600 + 200, 50, 'button').setInteractive();
    this.buttonBack.on('pointerdown', function () {
        this.cameras.main.fadeIn(500);
        this.timerEvent = this.time.addEvent({
            delay: 500,
            callback: function () {
                this.scene.start('Category');
            },
            callbackScope: this
        });


    }, this);
    this.buttonBack.setDepth(2);
    this.buttonBack.setScale(2, 1);
}

puzzleMenu.createMenu = function () {

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
            console.log('fadeout?')
            this.cameras.main.fadeOut(500);
            this.timerEvent = this.time.addEvent({
                delay: 500,
                callback: function () {
                    this.scene.start('PuzzleSetup', [{ 'puzzleImage': 'thumb_' + this.category + i, 'category': this.category }]);
                },
                callbackScope: this
            });
        }, this);
    }

}

puzzleMenu.createScrollObject = function (data) {
    //using rexui plugin create scrollable panel containing all my puzzle images
    let imageScale = 0.6;
    var panel = this.rexUI.add.scrollablePanel({
        x: this.game.config.width / 2, y: 300,
        width: 800,
        scrollMode: 'x',
        background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, this.COLOR_PRIMARY),
        panel: {
            child: createContent(this),
        },
        slider: {
            track: this.rexUI.add.roundRectangle(0, 0, 20, 50, 10, this.COLOR_DARK),
            thumb: this.rexUI.add.roundRectangle(0, 0, 0, 40, 40, this.COLOR_LIGHT),
        },
    })
        .layout()
    for (let i = 0; i < this.imageLength; i++) {
        panel
            .getElement('panel')
            .add(                
                //add image
                this.add.image(0, 0, 'thumb_' + this.category + i).setScale(imageScale)
                    .setInteractive()
                    .on('pointerdown', function () {
                        console.log('fadeout?')
                        this.cameras.main.fadeOut(500);
                        this.timerEvent = this.time.addEvent({
                            delay: 500,
                            callback: function () {
                                this.scene.start('PuzzleSetup', [{ 'puzzleImage': 'thumb_' + this.category + i, 'category': this.category }]);
                            },
                            callbackScope: this
                        });
                    }, this),                                    
            )
        panel.layout()
    }
}

var createContent = function (scene) {
    var panel = scene.rexUI.add.sizer({
        orientation: 'x',
        space: { item: 100, top: 20, bottom: 20 }
    })

    return panel
}

var CreatePanel = function (scene) {
    var panel = scene.rexUI.add.sizer({
        orientation: 'x',
        space: { item: 50, top: 20, bottom: 20 }
    })

    var contentList = ['AAAA', 'BBBB', 'CCCC', 'DDDDD', 'EEEEE', 'FFFFF'];
    for (var i = 0, cnt = contentList.length; i < cnt; i++) {
        panel
            .add(
                CreatePaper(scene,
                    contentList[i],
                    scene.rexUI.add.roundRectangle(0, 0, 200, 400, 20, this.COLOR_PRIMARY))
            )
    }

    return panel;
}

var CreatePaper = function (scene, content, background) {
    return scene.rexUI.add.label({
        orientation: 'y',
        width: background.displayWidth,
        height: background.displayHeight,

        background: background,
        text: scene.add.text(0, 0, content),

        align: 'center'
    })
}

var CreatePuzzleImages = function (scene, content, image) {
    
}



