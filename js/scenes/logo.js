let logoScene = new Phaser.Scene('Logo');

logoScene.preload = function () {
    
    this.load.image('logo', 'assets/images/UGLogo.png');
    this.load.image('gameLogo', 'assets/images/PuzzleLogoPH.jpg');
    //this.load.glsl('BnWShader', 'assets/shaders/BnWShader.frag');    
}

logoScene.create = function () {
    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;

    this.add.image(this.gameW/2, this.gameH/2 + 160, 'logo').setScale(1);
    this.add.image(this.gameW / 2, this.gameH / 2 - 100, 'gameLogo').setScale(0.16);
    
    //fade in camera
    this.cameras.main.fadeIn(1000);
    //open loadingScene after 3 seconds
    this.time.addEvent({
        delay: 3000,
        callback: function () {
            this.cameras.main.fadeOut(1000);
            this.loadNext();
        },
        callbackScope: this
    });
}

logoScene.loadNext = function () {
    this.time.addEvent({
        delay:1000,
        callback: function () {
            this.scene.start('LoadingScene');
        },
        callbackScope: this
    })
}