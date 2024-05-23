let specificPuzzleSelector = new Phaser.Scene('SpecificPuzzleSelector');

specificPuzzleSelector.init = function () {
    //create black graphic fill the whole screen
    this.endGameGraphic = this.add.graphics();

    this.endGameGraphic.fillStyle(0x000000, 1);
    this.endGameGraphic.fillRect(0, 0, this.game.config.width, this.game.config.height);
    this.endGameGraphic.setDepth(1);
    this.endGameGraphic.setAlpha(1);

    //create text at the middle saying loading images
    this.loadText = this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Loading Images Please Wait...', { font: '28px Arial', fill: '#fff' }).setOrigin(0.5);
    this.loadText.setDepth(1);
    this.puzzleData = this.cache.json.get('puzzleData'); 

}
specificPuzzleSelector.preload = function () {
    this.load.scenePlugin({
        key: 'rexuiplugin',
        url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
        sceneKey: 'rexUI'
    });     
}
specificPuzzleSelector.create = function () {

    this.COLOR_PRIMARY = 0x4e342e;
    this.COLOR_LIGHT = 0x7b5e57;
    this.COLOR_DARK = 0x260e04;


    const buttonPositions = [
        { name: 'animBtn' },
        { name: 'carsBtn' },
        { name: 'natureBtn' },
        { name: 'placesBtn' },
        { name: 'techBtn' },
        { name: 'underwaterBtn' },
    ];

    const cropY = 65;
    const yOffset = 80;
    const yPos = 125;

    const buttonTexts = {
        animBtn: 'ANIMALS',
        carsBtn: 'CARS',
        natureBtn: 'NATURE',
        placesBtn: 'PLACES',
        techBtn: 'TECH',
        underwaterBtn: 'UNDERWATER',
    };

    for (let i = 0; i < buttonPositions.length; i++) {
        let button = buttonPositions[i];
        button.y = yPos + i * yOffset;
        let sprite = this.add.sprite(200, button.y, button.name)
            .setCrop(0, 0, 256, cropY);
        sprite.setInteractive();
        //add event on click sprite
        sprite.on('pointerdown', function () {
            this.refreshScrollRect();
        }, this);
        
         //add text in the position of the sprite
         let btnText = this.add.text(sprite.x, sprite.y - cropY / 2 + 5, 'RANDOM', { font: '28px Arial', fill: '#fff' }).setOrigin(0.5);
         btnText.setText(buttonTexts[button.name]);
    }

    // buttonPositions.forEach((button, index) => {
    //     button.y = yPos + index * yOffset;
    //     let sprite = this.add.sprite(200, button.y, button.name)
    //         .setCrop(0, 0, 256, cropY);
    //     //add text in the position of the sprite
    //     let btnText = this.add.text(sprite.x, sprite.y - cropY / 2 + 5, 'RANDOM', { font: '28px Arial', fill: '#fff' }).setOrigin(0.5);
    //     btnText.setText(buttonTexts[button.name]);
    // });

    this.createScrollRect();
    // this.endGameGraphic.setAlpha(0);
    // this.loadText.setVisible(false);
}

specificPuzzleSelector.createScrollRect = function () {
 
    let imageScale = 0.45;
    this.category = 'animal';
    this.imageLength = 5;
    
    this.panel = this.rexUI.add.scrollablePanel({
        x: this.game.config.width / 2 + 180, y: 300,
        width: 600,
        scrollMode: 'x',
        background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, this.COLOR_PRIMARY),
        panel: {
            child: createContent(this),
            mask: { padding: 1 },
        },
        slider: {
            track: this.rexUI.add.roundRectangle(0, 0, 20, 50, 10, this.COLOR_DARK),
            thumb: this.rexUI.add.roundRectangle(0, 0, 0, 40, 40, this.COLOR_LIGHT),
        },
        scroller: {
            // pointerOutRelease: false
        },
        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,

            panel: 10,
            // slider: { left: 30, right: 30 },
        }
    })
        .layout()
    
    for (let i = 0; i < this.imageLength; i++) {
        this.panel
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
        this.panel.layout()
    }

    this.endGameGraphic.setAlpha(0);
    this.loadText.setVisible(false);
}

specificPuzzleSelector.refreshScrollRect = function () {

    console.log('refresh list' + this.panel);
}

var createContent = function (scene) {
    // var panel = scene.rexUI.add.sizer({
    //     orientation: 'x',
    //     space: { item: 100 }
    // })
console.log('WTF!!!!')
}
