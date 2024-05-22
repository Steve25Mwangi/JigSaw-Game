let categoryScene = new Phaser.Scene('Category');

categoryScene.preload = function () {
    this.load.image('animBtn', 'assets/images/animBtn.png');
    this.load.image('carsBtn', 'assets/images/carsBtn.png');
    this.load.image('natureBtn', 'assets/images/natureBtn.png');
    this.load.image('placesBtn', 'assets/images/placesBtn.png');
    this.load.image('techBtn', 'assets/images/techBtn.png');
    this.load.image('underwaterBtn', 'assets/images/underwaterBtn.png');
}

categoryScene.create = function () {
    this.cameras.main.fadeIn(1000);
    
    let centerX = this.cameras.main.width / 2;
    let centerY = this.cameras.main.height / 2;
    let verticalOffset = 150;    
    let topPos = 70;
    let midPos = topPos + verticalOffset;
    let botPos = midPos + verticalOffset;
    let rightPos = centerX + 50;
    let leftPos = centerX - 300;
    let buttonConfig = [
        { name: 'Animals', image: 'animBtn', category: 'animal', posX: leftPos, posY: topPos },
        { name: 'Cars', image: 'carsBtn', category: 'cars', posX: rightPos, posY: topPos },
        { name: 'Nature', image: 'natureBtn', category: 'nature', posX: leftPos, posY: midPos },
        { name: 'Places', image: 'placesBtn', category: 'places', posX: rightPos, posY: midPos },
        { name: 'Technology', image: 'techBtn', category: 'technology', posX: leftPos, posY: botPos },
        { name: 'Underwater', image: 'underwaterBtn', category: 'underwater', posX: rightPos, posY: botPos }
    ];

    let textConfig = {
        font: '24px Arial',
        fill: '#ffffff',
        setOrigin: 0.5
    };

    buttonConfig.forEach(button => {
        let buttonSprite = this.add.sprite(button.posX, button.posY, button.image).setOrigin(0).setScale(1);
        buttonSprite.setInteractive().on('pointerdown', () => {                    
            console.log('fadeout?')
            this.cameras.main.fadeOut(500);
            this.timerEvent = this.time.addEvent({
                delay: 500,
                callback: function () {
                    this.scene.start('PuzzleMenu', button.category);
                },
                callbackScope: this
            });
            
        });
        this.add.text(buttonSprite.x + 125, buttonSprite.y + 55, button.name, textConfig).setOrigin(0.5);
    });
}

categoryScene.createScrollObject= function () {
    this.cameras.main.fadeIn(1000);
}

