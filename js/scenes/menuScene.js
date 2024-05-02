//// create a new scene
let menuScene = new Phaser.Scene('Menu');

menuScene.init = function (data) {   
    
    this.puzzleData = data[0].puzzleData;
    this.audio = data[1];
    //console.log(data[1].audio.key);
    //console.log(this.puzzleData.puzzleSettings.length);
    
}

menuScene.preload = function () {
    ////load all images in this.puzzleData
    for (let i = 0; i < this.puzzleData.puzzleSettings.length; i++) {
        this.load.image('thumbnails' + i, this.puzzleData.puzzleSettings[i].puzzleImage);
    }
}

menuScene.create = function () {
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
    for (let i = 0; i < this.puzzleData.puzzleSettings.length; i++) {
        // Calculate the row and column index
        let rowIdx = Math.floor(i / colNo);
        let colIdx = i % colNo;
        
        // Calculate the position of the image
        let xPos = xStart + colIdx * (puzzleWidth + xSpace) + offset;
        let yPos = yStart + rowIdx * (puzzleHeight + ySpace) + offset;
        
        // Create and position the image
        let puzzleImage = this.add.image(xPos, yPos, 'thumbnails' + i);
        puzzleImage.setScale(Math.min(xSpace / puzzleImage.width, ySpace / puzzleImage.height));
        puzzleImage.setOrigin(0.5);
        
        // Add interactivity to the image
        puzzleImage.setInteractive();
        puzzleImage.on('pointerdown', function () {
            //console.log("open game scene with puzzle index " + i);
            this.scene.start('MainGame', [{puzzleData: this.puzzleData, puzzleIndex: i},{audio: this.audio}]);
        }, this);
    }
}


//create menu
// let rowNo = 5;//Math.ceil(Math.sqrt(this.puzzleData.puzzleSettings.length));
// let colNo = 3;//Math.ceil(this.puzzleData.puzzleSettings.length/rowNo);
// let xSpace = (this.game.config.width - (colNo - 1) * 20) / colNo;
// console.log(xSpace);
// let ySpace = (this.game.config.height - (rowNo - 1) * 20) / rowNo;
// console.log(ySpace);
// let xStart = 200;
// let xEnd = this.game.config.width - 200;
// let yStart = 100;
// let yEnd = this.game.config.height - 100;
// let xPos = xStart;
// let yPos = yStart;
// for (let i = 0; i < this.puzzleData.puzzleSettings.length; i++) {
//     let puzzleImage = this.add.image(xPos, yPos, 'thumbnails' + i);
//     //autoscale image to fit the space
//     puzzleImage.setScale(Math.min(xSpace/puzzleImage.width, ySpace/puzzleImage.height));
//     //center the image
//     puzzleImage.setOrigin(0);
//     xPos += 200;
    
//     if ((i + 1) % colNo === 0 || i === this.puzzleData.puzzleSettings.length - 1) {
//         xPos = xStart;
//         yPos += 150;
//     }
//     // limit x position between xStart and xEnd
//     if (xPos > xEnd) {
//         xPos = xEnd;
//     }
//     // limit y position between yStart and yEnd
//     if (yPos > yEnd) {
//         yPos = yEnd;
//     }
//     puzzleImage.setInteractive();
//     puzzleImage.on('pointerdown', function () {
//         console.log("open game scene with puzzle index " + i);
//         this.scene.start('MainGame', {puzzleData: this.puzzleData, puzzleIndex: i});
//     }, this);
// }