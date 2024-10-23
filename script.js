let canvas = document.getElementById("canvas");
// .getContent Returns a static collection of nodes representing the flow's source content.
let context = canvas.getContext("2d");
//to set it to a px size you don't need speech marks or 'px' at the end.
canvas.width = 1000;
canvas.height = 1000;

// chain array needs to be declared outside of the function or it clears every time the function is called. 
let chainArr = ['A3',];
let validCircuit = false;

// stores the value for the center of the cube
let middlePointLocation = { x: 0, y: 0 };

canvas.style.border = "5px solid black"

let canvasWidth = canvas.width;
// console.log("canvas width = ", canvasWidth);
let canvasHeight = canvas.height;
// console.log("canvas height = ", canvasHeight);

let currentShape;
let startX;
let startY;
//holds values that apply when the page is scaled (?)
let offsetX;
let offsetY;
let neighbourShape;
//holds shapes as an array
let shapes = [];
//makes an object that holds the tiles and associated connections per tile.
let tileConnections = {};
let zoneStartX;
let zoneStartY;
let isDragging = false;
let keysToDelete = [];
let haveKeysBeenPushed = false;
let allShapesArr = [];
let noRotateArr = [] //holds the tiles that can't rotate.

//sets a tile type for looking at neighbouring tiles
let currentShapesIndex;
// x and y declare where in the canvas the shapes are going to be drawn
//shapes.push({ x: 140, y: 20, width: 40, height: 40, color: 'green', shapeIndex: 0}); //shape to hold the rotate button

let gridRef;

let rotateClicked

let cellCoords = {
    "A1": { x: 0, y: 0 },
    "A2": { x: 200, y: 0 },
    "A3": { x: 400, y: 0 },
    "A4": { x: 600, y: 0 },
    "A5": { x: 800, y: 0 },
    "B1": { x: 0, y: 200 },
    "B2": { x: 200, y: 200 },
    "B3": { x: 400, y: 200 },
    "B4": { x: 600, y: 200 },
    "B5": { x: 800, y: 200 },
    "C1": { x: 0, y: 400 },
    "C2": { x: 200, y: 400 },
    "C3": { x: 400, y: 400 },
    "C4": { x: 600, y: 400 },
    "C5": { x: 800, y: 400 },
    "D1": { x: 0, y: 600 },
    "D2": { x: 200, y: 600 },
    "D3": { x: 400, y: 600 },
    "D4": { x: 600, y: 600 },
    "D5": { x: 800, y: 600 },
    "E1": { x: 0, y: 800 },
    "E2": { x: 200, y: 800 },
    "E3": { x: 400, y: 800 },
    "E4": { x: 600, y: 800 },
    "E5": { x: 800, y: 800 },
};

//tile type gives the possible connections of each tile
let tileType = {
    power: { top: false, right: false, bottom: true, left: false },
    rAngle1: { top: false, right: false, bottom: true, left: true },
    rAngle2: { top: true, right: false, bottom: false, left: true },
    rAngle3: { top: true, right: true, bottom: false, left: false },
    rAngle4: { top: false, right: true, bottom: true, left: false },
    lambda: { top: true, right: true, bottom: false, left: true },
    straightVert: { top: true, right: false, bottom: true, left: false },
    straightHrz: { top: false, right: true, bottom: false, left: true },
    led1: { top: true, right: false, bottom: true, left: false, liveEnd: 'top' },
    led2: { top: false, right: true, bottom: false, left: true, liveEnd: 'right' },
    led3: { top: true, right: false, bottom: true, left: false, liveEnd: 'bottom' },
    led4: { top: false, right: true, bottom: false, left: true, liveEnd: 'left' },
    tSection1: { top: true, right: false, bottom: true, left: true },
    tSection2: { top: true, right: true, bottom: false, left: true },
    tSection3: { top: true, right: true, bottom: true, left: false },
    tSection4: { top: false, right: true, bottom: true, left: true },
    cornerLedAC1: { top: false, right: false, bottom: true, left: true },
    cornerLedAC2: { top: true, right: false, bottom: false, left: true },
    cornerLedAC3: { top: true, right: true, bottom: false, left: false },
    cornerLedAC4: { top: false, right: true, bottom: true, left: false },
    cornerLedCW1: { top: false, right: false, bottom: true, left: true },
    cornerLedCW2: { top: true, right: false, bottom: false, left: true },
    cornerLedCW3: { top: true, right: true, bottom: false, left: false },
    cornerLedCW4: { top: false, right: true, bottom: true, left: false },
}

// Additional tiles: 2 Corner LEDs, 1 blank, 1 x, 1 switch, 1 bridge.
// cell types separates out all the various shapes to make them easier to manipulate. 
let tileName = {
    "Power": { cellName: 'power', x: 400, y: 0, width: 200, height: 200, color: 'green', imgSrc: 'img/power.jpg', type: tileType.power, currentCell: 'A3', lastCellValue: '', canMove: false, isConnected: true, connectionsNum: 0, isTileAnLED: false },
    "R_Angle_1": { cellName: 'r_angle_1', x: 400, y: 200, width: 200, height: 200, color: 'red', imgSrc: 'img/r_angle_dead_1.jpg',   type: tileType.rAngle1, currentCell: 'B3', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: false },
    "R_Angle_2": { cellName: 'r_angle_2', x: 400, y: 400, width: 200, height: 200, color: 'black', imgSrc: 'img/r_angle_dead_2.jpg', type: tileType.rAngle2, currentCell: 'C3', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: false },
    "R_Angle_3": { cellName: 'r_angle_3', x: 0, y: 0, width: 200, height: 200, color: 'blue', imgSrc: 'img/r_angle_dead_3.jpg',      type: tileType.rAngle3, currentCell: 'A1', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: false },
    "R_Angle_4": { cellName: 'r_angle_4', x: 200, y: 200, width: 200, height: 200, color: 'green', imgSrc: 'img/r_angle_dead_4.jpg', type: tileType.rAngle4, currentCell: 'B2', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: false },
    "Lambda": { cellName: 'lambda', x: 400, y: 800, width: 200, height: 200, color: 'red', imgSrc: 'img/lambda_dead.jpg',            type: tileType.lambda, currentCell: 'E3', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: false },
    "Straight_Vert": { cellName: 'straight_vert', x: 200, y: 600, width: 200, height: 200, color: 'red', imgSrc: 'img/straight_vert_dead.jpg', type: tileType.straightVert, currentCell: 'D2', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: false },
    "Straight_Hrz": { cellName: 'straight_hrz', x: 600, y: 800, width: 200, height: 200, color: 'red', imgSrc: 'img/straight_hrz_dead.jpg',    type: tileType.straightHrz,  currentCell: 'E4', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: false },
    "Led_1": { cellName: 'led_1', x: 800, y: 800, width: 200, height: 200, color: 'red', imgSrc: 'img/led_dead_1.jpg', type: tileType.led1, currentCell: 'E5', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: true },
    "Led_2": { cellName: 'led_2', x: 800, y: 800, width: 200, height: 200, color: 'red', imgSrc: 'img/led_dead_2.jpg', type: tileType.led2, currentCell: 'E4', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: true },
    "Led_3": { cellName: 'led_3', x: 800, y: 800, width: 200, height: 200, color: 'red', imgSrc: 'img/led_dead_3.jpg', type: tileType.led3, currentCell: 'E4', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: true },
    "Led_4": { cellName: 'led_4', x: 800, y: 800, width: 200, height: 200, color: 'red', imgSrc: 'img/led_dead_4.jpg', type: tileType.led4, currentCell: 'E4', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: true },
    "T_Section_1": { cellName: 't_section_1', x: 200, y: 800, width: 200, height: 200, color: 'red', imgSrc: 'img/T_section_dead_1.jpg',  type: tileType.tSection1, currentCell: 'E2', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: false },
    "T_Section_2": { cellName: 't_section_2', x: 0, y: 800, width: 200, height: 200, color: 'red', imgSrc: 'img/T_section_dead_2.jpg',    type: tileType.tSection2, currentCell: 'E1', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: false },
    "T_Section_3": { cellName: 't_section_3', x: 0, y: 800, width: 200, height: 200, color: 'red', imgSrc: 'img/T_section_dead_3.jpg',    type: tileType.tSection3, currentCell: 'E4', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: false },
    "T_Section_4": { cellName: 't_section_4', x: 0, y: 800, width: 200, height: 200, color: 'red', imgSrc: 'img/T_section_dead_4.jpg',    type: tileType.tSection4, currentCell: 'E4', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: false },
    "Corner_LED_AC_1": { cellName: 'corner_led_ac_1', x: 800, y: 0, width: 200, height: 200, color: 'red', imgSrc: 'img/corner_LED_dead_AC_1.jpg', type: tileType.cornerLedAC1, currentCell: 'A5', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: true },
    "Corner_LED_AC_2": { cellName: 'corner_led_ac_2', x: 800, y: 0, width: 200, height: 200, color: 'red', imgSrc: 'img/corner_LED_dead_AC_2.jpg', type: tileType.cornerLedAC2, currentCell: 'B5', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: true },
    "Corner_LED_AC_3": { cellName: 'corner_led_ac_3', x: 800, y: 0, width: 200, height: 200, color: 'red', imgSrc: 'img/corner_LED_dead_AC_3.jpg', type: tileType.cornerLedAC3, currentCell: 'B5', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: true },
    "Corner_LED_AC_4": { cellName: 'corner_led_ac_4', x: 800, y: 0, width: 200, height: 200, color: 'red', imgSrc: 'img/corner_LED_dead_AC_4.jpg', type: tileType.cornerLedAC4, currentCell: 'B5', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: true },
    "Corner_LED_CW_1": { cellName: 'corner_led_cw_1', x: 800, y: 400, width: 200, height: 200, color: 'red', imgSrc: 'img/corner_LED_dead_CW_1.jpg', type: tileType.cornerLedCW1, currentCell: 'C5', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: true },
    "Corner_LED_CW_2": { cellName: 'corner_led_cw_2', x: 800, y: 0, width: 200, height: 200, color: 'red', imgSrc: 'img/corner_LED_dead_CW_2.jpg', type: tileType.cornerLedCW1, currentCell: 'B5', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: true },
    "Corner_LED_CW_3": { cellName: 'corner_led_cw_3', x: 800, y: 0, width: 200, height: 200, color: 'red', imgSrc: 'img/corner_LED_dead_CW_3.jpg', type: tileType.cornerLedCW1, currentCell: 'B5', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: true },
    "Corner_LED_CW_4": { cellName: 'corner_led_cw_4', x: 800, y: 0, width: 200, height: 200, color: 'red', imgSrc: 'img/corner_LED_dead_CW_4.jpg', type: tileType.cornerLedCW1, currentCell: 'B5', lastCellValue: '', canMove: true, isConnected: false, connectionsNum: 0, isTileAnLED: true },
}

//pushes the tiles to the shapes array. 
shapes.push(tileName.Power);
shapes.push(tileName.R_Angle_1);
shapes.push(tileName.R_Angle_2);
shapes.push(tileName.R_Angle_3);
shapes.push(tileName.R_Angle_4);
shapes.push(tileName.Lambda);
shapes.push(tileName.Straight_Vert);
shapes.push(tileName.Straight_Hrz);
shapes.push(tileName.Led_1);
shapes.push(tileName.T_Section_2);
shapes.push(tileName.T_Section_1);
shapes.push(tileName.Corner_LED_AC_1);
shapes.push(tileName.Corner_LED_CW_1);

//ctrl+shift+L allows you to select all similar values, use with caution!

//JavaScript callback is a function which is to be executed after another function has finished execution
//A callback is a function passed as an argument to another function. This technique allows a function to call another function
//A callback function can run after another function has finished

function loadImage(src, callback) {
    //creates a new HTML Image element/image object using the 'new Image()' constructor.
    //console.log("values of shapes array being called in the loadImage function", shapes) //this proves that the imgSrc are correct.
    const img = new Image();
    //"img.onload" is an event handler that gets called when the image has finished loading successfully. The arrow function "() => callback(img)" is assigned to img.onload. 
    //This means that when the image has loaded, the function callback will be called with img (the loaded image object) as its argument.
    //drawShapes is the callback function. 
    img.onload = () => callback(img);
    //sets the src attribute of the img object to the provided src argument. Setting img.src starts the process of loading the image from the specified URL.
    img.src = src;
}

//BUG! Occasional dead tile despite the correct imgSrc being passed into this function

//load Images, does as it says, it loads the images > then the drawShapes function is called which renders the images. 
function loadImages(shapes, drawShapesCallback) {
    //console.log("load images called");
    let loadedCount = 0; // Counter to track how many images have loaded

    shapes.forEach(shape => {  // Loop through each shape in the `shapes` array, 
        if (shape.imgSrc) { // Check if the shape has an `imgSrc` property
            loadImage(shape.imgSrc, (img) => {  // Asynchronously load the image using `loadImage` function above
                shape.image = img;  // Once the image is loaded, assign it to the shape’s `image` property
                loadedCount++;  // Increment the counter when an image is successfully loaded

                //console.log(img); // console log here also seems to fix the dead, not 100% fix
                //console.clear();

                if (loadedCount === shapes.length) {  // Check if all images have been loaded (by comparing `loadedCount` to the number of shapes)

                    drawShapesCallback();  // Once all images are loaded, call the `callback` function (usually `drawShapes`)
                    //A callback is a function passed as an argument to another function. This technique allows a function to call another function
                    //A callback function can run after another function has finished
                }
            });
        } else {  // If the shape doesn’t have an image source (`imgSrc`), we still need to update the counter
            loadedCount++;  // Increment the counter even if there's no image to load

            if (loadedCount === shapes.length) {  // Check if all shapes (with or without images) have been processed

                drawShapesCallback();  // Call the callback function when all shapes have been handled

            }
        }
    });
}


// creates the vertical grid lines array
let vertGridLines = [];
vertGridLines.push({ x: 200, y: 0, width: 4, height: canvasHeight, color: 'blacK' });
vertGridLines.push({ x: 400, y: 0, width: 4, height: canvasHeight, color: 'blacK' });
vertGridLines.push({ x: 600, y: 0, width: 4, height: canvasHeight, color: 'blacK' });
vertGridLines.push({ x: 800, y: 0, width: 4, height: canvasHeight, color: 'blacK' });

// draws the vert grid
function drawVertGrid() {
    // context.clearRect(0,0, canvasWidth, canvasHeight);
    for (let vertGridLine of vertGridLines) {
        context.fillStyle = vertGridLine.color;
        context.fillRect(vertGridLine.x, vertGridLine.y, vertGridLine.width, vertGridLine.height)
        // console.log(vertGridLine)
    }
}
drawVertGrid();

// creates the horizontal grid lines array
let horizGridLines = [];
horizGridLines.push({ x: 0, y: 200, width: canvasWidth, height: 4, color: 'black' })
horizGridLines.push({ x: 0, y: 400, width: canvasWidth, height: 4, color: 'black' })
horizGridLines.push({ x: 0, y: 600, width: canvasWidth, height: 4, color: 'black' })
horizGridLines.push({ x: 0, y: 800, width: canvasWidth, height: 4, color: 'black' })

function drawHorizGrid() {
    // context.clearRect(0,0, canvasWidth, canvasHeight);
    for (let horizGridLine of horizGridLines) {
        context.fillStyle = horizGridLine.color;
        context.fillRect(horizGridLine.x, horizGridLine.y, horizGridLine.width, horizGridLine.height)
        // console.log(horizGridLine)
    }
}
drawHorizGrid();

//for using an image rather than a js drawn grid ----------- NOT IN USE CURRENTLY ----------------
function backgroundCanvasImg() {
    base_image = new Image();
    base_image.src = 'img/fiveByFiveGrid.gif'
    base_image.onload = function () {
        context.drawImage(base_image, 0, 0);
    }
} // This function is currently never called!! 

// backgroundCanvasImg(); 
// set co-ordinates for the grid squares
let zones = [];

//set bounding areas for squares
let zoneWidth = 200;
let zoneHeight = 200;
let numRows = 5; // Number of rows
let numCols = 5; // Number of columns

// nested for loops, goes along the top row first
for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
        let zone = {
            //creates the values for the zones start points
            x: col * zoneWidth,
            y: row * zoneHeight,
            // width and height are always the same as they are square. 
            width: zoneWidth,
            height: zoneHeight,
            //String.fromCharCode is a method that converts Unicode values into characters.
            //97 is the Unicode value for the lowercase letter 'a'.
            //Adding row to 97 shifts the character code to generate subsequent letters.
            zoneName: `${String.fromCharCode(97 + row)}${col + 1}` // For example, "a1", "a2", ..., "b1", "b2", ...
        };
        //pushes the new object to the array
        zones.push(zone);
    }
}
//console.log("zones ", zones);

//find the middle point of the moving object
function findMiddlePoint() {
    //current shapes index needs to be used here or all the shapes default to the square of the first one.
    middlePointLocation.x = shapes[currentShapesIndex].x + 100;
    middlePointLocation.y = shapes[currentShapesIndex].y + 100;
    // console.log("middle point location =", middlePointLocation);
}

// the check cell function looks to see which cell the active tile has been dropped in. 
// the value of this cell is then sent to the checkNeighbour function which then searches surrounding tiles for a live connection.  
function checkCell() {
    //console.log("Check cell has been run")

    chainArr = []  // see lines

    let squareX = middlePointLocation.x;
    let squareY = middlePointLocation.y;
    let squareRef = { column: 0, row: 0 };

    currentShape = shapes[currentShapesIndex];

    //Checks X axis 
    if (squareX < 200) {
        squareRef.column = 1;
    } else if (squareX > 200 && squareX < 400) {
        squareRef.column = 2;
    } else if (squareX > 400 && squareX < 600) {
        squareRef.column = 3;
    } else if (squareX > 600 && squareX < 800) {
        squareRef.column = 4;
    } else if (squareX > 800) {
        squareRef.column = 5;
    };
    //Checks Y axis  
    if (squareY < 200) {
        squareRef.row = "A";
    } else if (squareY > 200 && squareY < 400) {
        squareRef.row = "B";
    } else if (squareY > 400 && squareY < 600) {
        squareRef.row = "C";
    } else if (squareY > 600 && squareY < 800) {
        squareRef.row = "D";
    } else if (squareY > 800) {
        squareRef.row = "E";
    };

    //holds the value of the last cell
    let lastCellVal = shapes[currentShapesIndex].lastCellValue
    lastCellVal = shapes[currentShapesIndex].currentCell;

    // console.log("cell containing the center of the square", squareRef);
    cellRef = `${squareRef.row}${squareRef.column}`
    //console.log(cellRef);

    //iterates over all tiles and sees if there is an tile with the same cellRef. 
    // compares it against all existing tiles so you get a multiple console log
    for (let shape of shapes) {
        if (shape.currentCell == cellRef) {
            //console.log("overlapping cell!");

            //set the tiles co-ordinates to last valid cell
            // sets the currentCell property of the tile to lastCellVal
            shapes[currentShapesIndex].currentCell = lastCellVal;
            //console.log("Moving tile to last valid cell:", currentShape.currentCell);
            //Need to pass in the values of the last valid cell NOT cell ref
            currentShape.x = cellCoords[lastCellVal].x
            currentShape.y = cellCoords[lastCellVal].y;
            snapTo();
            return; //exits the whole function
        }
    }

    // pushes the current cell ref to the tile that is in the cell. 
    shapes[currentShapesIndex].currentCell = cellRef;
    //gridRef holds the value of the cell occupied by the current tile
    gridRef = shapes[currentShapesIndex].currentCell;
    //console.log("current tile is in cell", gridRef);
    //console.log("previous cell value was", lastCellVal);

    // checks to see if the cellRef is the same as the cell co-ordinate,
    if (cellCoords[cellRef]) {
        currentShape.x = cellCoords[cellRef].x;
        currentShape.y = cellCoords[cellRef].y;
        //logs out the object key, e.g. A2
        //console.log("object key:", Object.keys(cellCoords)[1])
        //logs out the object value, e.g. x:200, y:0
        //console.log("object value:", Object.values(cellCoords)[1])
    }
    snapTo();
    //updates the value of the shapes x and y co-ordinates 

    //calls the checkNeighbour func to see if there are surrounding tiles, uses A3 as a start point to iterate from. 
    checkNeighbour('A3');
    checkForStartingCell(chainArr);

    // calling the change tile to dead here makes sure that all non-connected tiles are made dead. Argument passed in needs to be the start tile
    // don't use gridRef as a this does not start the chain at the start point but rather the tile that was moved > Breaks the code.
    changeTileToDead();
    //checkNeighbour('A3');

}

//X and Y co-ordinates and 'zone' are passed in by the mouseDownInZone function 
function isMouseInZone(x, y, zone) {
    //console.log("mouseInZone has been called");
    //these variables take the values from the for loop in the mouseDownInZone function 
    let zoneLeft = zone.x;
    let zoneRight = zone.x + zone.width;
    let zoneTop = zone.y;
    let zoneBottom = zone.y + zone.height;

    if (x > zoneLeft && x < zoneRight && y > zoneTop && y < zoneBottom) {
        // console.log(`click is inside zone ${zone.zoneName}`);
        return true;
    } else {
        // console.log("not inside zone");
        return false;
    }
}

//onmousedown this function is triggered, onmousedown @ line 212 
function mouseDownInZone(e) {
    // console.log("mouseDownInZone func clicked");
    //zoneStart variable give the x and y co-ordinates of the mouse click respectively. 
    zoneStartX = e.clientX; //removed passInt() 
    zoneStartY = e.clientY;
    // console.log(zoneStartX);
    // let zoneIndex = 0; // commented out as not needed??
    for (let zone of zones) {
        if (isMouseInZone(zoneStartX, zoneStartY, zone)) {
            // console.log("in zone === yes");
            // currentZoneIndex = zoneIndex; //commented out as not needed? 
            return;
        } else {
            // console.log("in zone === no");
        }
    }
};

//fills the screen:
// canvas.width = window.innerWidth - 15;
// canvas.height = window.innerHeight;

// getBoundingClientRect returns the size of an element and its position relative to the viewport, deals with screen re-sizing
function getOffset() {
    let canvasOffset = canvas.getBoundingClientRect();
    offsetX = canvasOffset.left;
    offsetY = canvasOffset.top;
}
getOffset();

window.onscroll = function () { getOffset(); }
window.onresize = function () { getOffset(); }
canvas.onresize = function () { getOffset(); }

//checks to see if the mouse is inside a shape
function isMouseInShape(x, y, shape) {
    let shapeLeft = shape.x;
    let shapeRight = shape.x + shape.width;
    let shapeTop = shape.y;
    let shapeBottom = shape.y + shape.height;

    if (x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom) {
        //console.log("is inside shape");
        return true;
    } else {
        // console.log("not inside shape");
        return false;
    }
}

//this is called when shapes are rotated, the mouseDown function calls this (if the button has been clicked)
function replaceTile(shape) {
    //console.log("Replace tile func has been called");
    //console.log(shape)

    let currentCellCoord = shape.currentCell; // gives the cell co-ordinate value e.g. A2
    //console.log("current cell Co-ord", currentCellCoord);

    // Access dynamic cell coordinates using bracket notation. Takes whatever value is passed into the [] and opens the reference in the cellCoord object. 
    const cellCoord = cellCoords[currentCellCoord];

    //console.log(shape.currentCell);
    //BUG: shapes.push is ugly. Need to replace object with a variable that holds it's value. This doesn't seem to work. Not sure why...?

    //R angle tiles
    if (shape.cellName == 'r_angle_1') {
        shapes.push({ cellName: 'r_angle_2', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/r_angle_dead_2.jpg', type: tileType.rAngle2, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    if (shape.cellName == 'r_angle_2') {
        shapes.push({ cellName: 'r_angle_3', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/r_angle_dead_3.jpg', type: tileType.rAngle3, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    if (shape.cellName == 'r_angle_3') {
        shapes.push({ cellName: 'r_angle_4', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/r_angle_dead_4.jpg', type: tileType.rAngle4, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    if (shape.cellName == 'r_angle_4') {
        shapes.push({ cellName: 'r_angle_1', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/r_angle_dead_1.jpg', type: tileType.rAngle1, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    //Straight tiles
    if (shape.cellName == 'straight_vert') {
        shapes.push({ cellName: 'straight_hrz', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/straight_hrz_dead.jpg', type: tileType.straightHrz, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })

    }
    if (shape.cellName == 'straight_hrz') {
        shapes.push({ cellName: 'straight_vert', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/straight_vert_dead.jpg', type: tileType.straightVert, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    //Led tiles
    if (shape.cellName == 'led_1') {
        shapes.push({ cellName: 'led_2', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/led_dead_2.jpg', type: tileType.led2, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    if (shape.cellName == 'led_2') {
        shapes.push({ cellName: 'led_3', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/led_dead_3.jpg', type: tileType.led3, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    if (shape.cellName == 'led_3') {
        shapes.push({ cellName: 'led_4', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/led_dead_4.jpg', type: tileType.led4, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    if (shape.cellName == 'led_4') {
        shapes.push({ cellName: 'led_1', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/led_dead_1.jpg', type: tileType.led1, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    // T shapes
    if (shape.cellName == 't_section_1') {
        shapes.push({ cellName: 't_section_2', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/T_section_dead_2.jpg', type: tileType.tSection2, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    if (shape.cellName == 't_section_2') {
        shapes.push({ cellName: 't_section_3', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/T_section_dead_3.jpg', type: tileType.tSection3, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    if (shape.cellName == 't_section_3') {
        shapes.push({ cellName: 't_section_4', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/T_section_dead_4.jpg', type: tileType.tSection4, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    if (shape.cellName == 't_section_4') {
        shapes.push({ cellName: 't_section_1', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/T_section_dead_1.jpg', type: tileType.tSection1, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    //Corner LED Anti-clockwise
    if (shape.cellName == 'corner_led_ac_1') {
        shapes.push({ cellName: 'corner_led_ac_2', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/corner_LED_dead_AC_2.jpg', type: tileType.cornerLedAC2, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    if (shape.cellName == 'corner_led_ac_2') {
        shapes.push({ cellName: 'corner_led_ac_3', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/corner_LED_dead_AC_3.jpg', type: tileType.cornerLedAC3, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    if (shape.cellName == 'corner_led_ac_3') {
        shapes.push({ cellName: 'corner_led_ac_4', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/corner_LED_dead_AC_4.jpg', type: tileType.cornerLedAC4, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    if (shape.cellName == 'corner_led_ac_4') {
        shapes.push({ cellName: 'corner_led_ac_1', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/corner_LED_dead_AC_1.jpg', type: tileType.cornerLedAC1, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    //Corner LED Clockwise
    if (shape.cellName == 'corner_led_cw_1') {
        shapes.push({ cellName: 'corner_led_cw_2', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/corner_LED_dead_CW_2.jpg', type: tileType.cornerLedCW2, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    if (shape.cellName == 'corner_led_cw_2') {
        shapes.push({ cellName: 'corner_led_cw_3', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/corner_LED_dead_CW_3.jpg', type: tileType.cornerLedCW3, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    if (shape.cellName == 'corner_led_cw_3') {
        shapes.push({ cellName: 'corner_led_cw_4', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/corner_LED_dead_CW_4.jpg', type: tileType.cornerLedCW4, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }
    if (shape.cellName == 'corner_led_cw_4') {
        shapes.push({ cellName: 'corner_led_cw_1', x: cellCoord.x, y: cellCoord.y, width: 200, height: 200, imgSrc: 'img/corner_LED_dead_CW_1.jpg', type: tileType.cornerLedCW1, currentCell: currentCellCoord, lastCellValue: '', canMove: true, })
    }

    //checkNeighbour needs to be called before the checkForStartingCell as clicking on the rotate button clears the chainArr   

    chainArr = []  //empties ChainArr, so each movement starts with a blank array
    keysToDelete = []; //empties the keysToDelete array so it starts from an empty array each tile move.
    changeTileToDead(); //changes all tiles do dead (as this function excluded and tiles in the chainArr, which is currently empty)

    checkNeighbour('A3'); //calls the recursive checkNeighbour function which iterates through cells starting at A3 an looks for neighbouring tiles that can connect
    checkForStartingCell(chainArr); //checks to make sure the chainArr contains the start and end cell. If it does not, every tile is marked as dead. 
    if (chainArr.length > 0) {
    console.log("chainArr called by the replace tile func", chainArr)
    }
}

//onmousedown these functions are triggered
function mouseDown(e) {
    e.preventDefault();

    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);

    for (let i = 0; i < shapes.length; i++) {
        let shape = shapes[i];
        if (isMouseInShape(startX, startY, shape)) {
            if (isMouseInRotateButton(startX, startY, shape)) {
                //console.clear();
                rotateClicked = true;
                tileConnections = {} //clears the tileConnections object so that it records connected tiles from a clean state (also cleared in the rotate func)     
                currentShapesIndex = i; // this sets the current shapes index to be the same as the cell clicked on. 
                // Rotate the shape 90 degrees
                //console.log("shape rotate button clicked")             

                //splice removes the tile from the array
                shapes.splice(currentShapesIndex, 1);  // splice takes 2 arguments the index of the element you wish to remove and the index you wish to remove up to.

                //add the next tile in the array (based on type) this makes it seem as if the tile has been rotated. 
                replaceTile(shape)


                return;

            } else {
                // Regular dragging behavior
                currentShapesIndex = i;
                isDragging = true;
                return;
            }
        }
    }
}

// checks to see if the cursor is on the mouse rotate button
function isMouseInRotateButton(x, y, shape) {
    let buttonX = shape.x + shape.width - 20;
    let buttonY = shape.y + 20;
    let distance = Math.sqrt((x - buttonX) ** 2 + (y - buttonY) ** 2);

    return distance < 15; // 15 is the radius of the rotate button, I have made this value larger to make it a bigger target
}

// mouse up event
function mouseUp(e) {
    if (!isDragging) {
        return;
    } else {
        e.preventDefault();
        findMiddlePoint();
        checkCell(); // This calls checkNeighbour func. Kick starts the whole checking for surrounding tiles process. 
        isDragging = false;

        keysToDelete = []; //empties the keysToDelete array so it starts from an empty array each tile move.
        chainArr = []  //empties ChainArr, so each movement starts with a blank array
        changeTileToDead(); //changes all tiles srcImg's to dead (as this function excluded and tiles in the chainArr, which is currently empty)

        checkNeighbour('A3'); //calls the recursive checkNeighbour function which iterates through cells starting at A3 an looks for neighbouring tiles that can connect
        checkForStartingCell(chainArr); //checks to make sure the chainArr contains the start and end cell. If it does not, every tile is marked as dead. 
        //console.log("chainArr called by the mouse up func", chainArr) //this will contain values as checkNeighbour has run (which populates the chainArr)

        //console.log("Chain array cleared on mouse up");
    }
}

function mouseOut(e) {
    if (!isDragging) {
        return;
    } else {
        e.preventDefault();
        isDragging = false;
    }
}

function mouseMove(e) {
    if (!isDragging) {
        return;
    } else {

        tileConnections = {} //clears the tileConnections object so that it records connected tiles from a clean state (also cleared in the rotate func)     

        // console.log("move with dragging");
        e.preventDefault();
        let mouseX = parseInt(e.clientX - offsetX);
        let mouseY = parseInt(e.clientY - offsetY);

        let mouseMoveDistanceX = mouseX - startX;
        let mouseMoveDistanceY = mouseY - startY;
        // console.log("distance from click, mouse X and mouse Y ", mouseMoveDistanceX, mouseMoveDistanceY)

        currentShape = shapes[currentShapesIndex];
        // console.log(currentShape);
        //updates the value of the shapes x and y co-ordinates
        currentShape.x += mouseMoveDistanceX;
        currentShape.y += mouseMoveDistanceY;

        drawShapes(); //live draws the shape so it can be physically dragged
        //console.log("square is moving")
        startX = mouseX;
        startY = mouseY;
    }
}

// listens for the mousedown event on the canvas
canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
canvas.onmouseout = mouseOut;
canvas.onmousemove = mouseMove;

async function drawShapes() {

    //console.log(tileName);

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawHorizGrid();
    drawVertGrid();

    for (let shape of shapes) {

        //test before image is drawn to see if the correct values for imgSrc have arrived at the drawShapes function
        if (!isDragging && rotateClicked == true) {
            //console.log(shape.imgSrc, "in cell", shape.currentCell ) 
        }

        //console.log(shape.image); console.log here forces the update but you end up with thousands of console.logs

        //force the function to wait until each shape has a shape.image
        if (shape.image) {
            await new Promise(resolve => {
                if (shape.image.complete) {
                    resolve();
                } else {
                    shape.image.onload = resolve;
                }
            });
        }
        //*********************************************************************************** */
        //here sits the golden console log. Killer of bugs. Defeater of asynchronous nonsense. Doesn't work 100% of the time but VASTLY improves functionality. 
        if (!isDragging) {

            //console.log("shape.image for each tile", shape.image); //<< here it is!

        }
        //console.log here forces the update but you end up with thousands of console.logs, almost forces the browser to acknowledge the tile imgSrc's
        //Proceed with drawing after the image is ready
        //*********************************************************************************** */
    }

    for (let shape of shapes) {

        context.save(); // Save the current state
        context.translate(shape.x + shape.width / 2, shape.y + shape.height / 2); // Move to the center of the shape
        context.translate(-shape.width / 2, -shape.height / 2); // Move back to the top left corner of the shape

        if (shape.image && shape.image.complete) {

            //Draw the image
            if (!isDragging) {
                //console.log(shape.image) //BUG this console log seems to fix the dead tile issue (mostly). BUT only when it is not commented out!  BUG!!!
                //makes the code far more stable    
            }
            //setTimeout(context.drawImage(shape.image, 0, 0, shape.width, shape.height), 150);  //using a set timeout here seems to make the code more stable?  
            context.drawImage(shape.image, 0, 0, shape.width, shape.height)
            //console.clear();
        } else {
            // Draw the shape with color (fallback)
            console.log(`Image not ready for tile ${shape.id}`);
            context.fillStyle = shape.color;
            context.fillRect(0, 0, shape.width, shape.height);
            console.log("Something has gone amiss")
        }

        //this section deals primarily with the rotate button:   
        context.restore(); // Restore the previous state, this keeps the dot when tiles are moved. 
        drawRotateButton();

        if (!isDragging && rotateClicked == true) {
            //console.log(shape.image) //BUG this console log seems to fix the dead tile issue (mostly). BUT only when it is not commented out!  BUG!!!
            //makes the code far more stable
            //console.log(`imgScr for: ${shape.cellName}, in cell ${shape.currentCell}, after drawShapes has been called =`, shape.imgSrc);
            //console.log("imgSrc values for all shapes:")

            //console.log(shape.imgSrc, "in cell", shape.currentCell ) //shows the imgSrc values of all the cells once the draw image func has been called
            //If the imgSrc is showing the tile as "live" in the console log, but it is being drawn as "dead," this suggests that the issue is likely related to how the image is being rendered on the canvas, rather than how it's being loaded or stored in the tile object.

            //THE CODE IS FINE THE RENDERING IS NOT!! OR CONTEXT RESTORE COULD BE REVERTING THE SHAPE?? ONLY SEEMS TO HAPPEN WHEN SHAPES ARE ROTATED
        }
    }
    rotateClicked = false;
};

function drawRotateButton() {
    //Separates out the draw button so it can also be invoked when the tile is clicked on but not moved from it's cell
    for (let shape of shapes) {
        // Draws the rotate button
        context.fillStyle = 'grey'; //Sets a colour
        context.beginPath();        //initiates the drawing?
        context.arc(shape.x + shape.width - 20, shape.y + 20, 10, 0, 2 * Math.PI); // sets the location for the dot to be drawn in each tile. And sets out the mathematical shape for the dot 
        context.fill(); //Fills the shape, Comment this out to hide the buttons
    }
}

//Load all shapes (with their relevant images) and then draw the shapes
//Called here this initialises the map. 
loadImages(shapes, drawShapes)

//Snaps tiles to the grid
function snapTo() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawHorizGrid();
    drawVertGrid();

    for (let shape of shapes) {
        if (shape.image) {
            // Draw the image
            context.drawImage(shape.image, shape.x, shape.y, shape.width, shape.height);
            drawRotateButton();
        } else {
            // Draw the shape with color (fallback)
            context.fillStyle = shape.color;
            context.fillRect(shape.x, shape.y, shape.width, shape.height);
        }
    }
}

//This part of the code works out what the surrounding letters are the current cell
//take a letter in as a parameter and return the previous letter
function getPreviousLetter(letter) {
    // Convert the letter to its ASCII code
    const charCode = letter.charCodeAt(0);
    // console.log(charCode)
    // Get the preceding letter by subtracting 1
    const precedingCharCode = charCode - 1;
    // Convert the ASCII code back to a letter
    const precedingLetter = String.fromCharCode(precedingCharCode)
    return precedingLetter;
}
//Take a letter in as a parameter and return the next letter
function getNextLetter(letter) {
    // Convert the letter to its ASCII code
    const charCode = letter.charCodeAt(0);
    // console.log(charCode)
    // Get the next letter by adding 1
    const precedingCharCode = charCode + 1;
    // Convert the ASCII code back to a letter
    const precedingLetter = String.fromCharCode(precedingCharCode)
    return precedingLetter;
}

//Final bits:
//LED -> How!!??, needs to be one directional. 
//Extra Tiles -> 
//Async live tiles issue ->
//levels ->
//remove the move button from the start and end tiles 
//Add resistance per tile -> standard tiles 0, LED's 1, how does this work in real life? 

//What do I need to do! BUG!
//need to check to see if the next tile in the array is an LED
//If the LED is facing the correct direction in relation to the power source then illuminate.
//check tile relative position, if current tile is above the next tile (e.g. A < B .... letter from currentCell value) AND the next tiles 'liveEnd' == top, mark live and carry on. 

//Else, check other possibilities
//Open side needs to be the one facing the power source
//if not, return

function isLED(cell) {
    for (let shape of shapes) {
        if (shape.currentCell == cell && (
            ['led_1', 'led_2', 'led_3', 'led_4', 'corner_led_ac_1', 'corner_led_ac_2', 'corner_led_ac_3', 'corner_led_ac_4', 'corner_led_cw_1', 'corner_led_cw_2', 'corner_led_cw_3', 'corner_led_cw_4']
            .includes(shape.cellName)) ? shape.cellName : false) 
        //Ternary, after the ? the options to follow depending on the condition and shape.name includes Led... 
        //if (shape.currentCell == cell && shape.isTileAnLED == true) // this simplified code does not seem to work for corner LED's.. not sure why... 
        { 
            console.log("Cell containing LED", shape.currentCell);

            //this removes A3 from the Array
            chainArr = chainArr.filter(item => item !== 'A3'); //item !== 'a3': This is the condition. It checks whether the current item in the array is not equal to 'a3'. If the item is not 'a3', the condition evaluates to true, and the item is kept in the new array. If the item is 'a3', the condition evaluates to false, and the item is excluded from the new array.
 
            //adds A3 to the beginning of the array
            chainArr.unshift('A3');

            let previousChainArrVal = chainArr[chainArr.length - 2];
            console.log("Cell preceding LED", previousChainArrVal)
            //TO DO: 
            //if previous tile (e.g. tile which matches previousChainArrVal) is above AND led liveEnd == above, then carry on. Else exit the function, 
            //Runs into issues if there is a circuit with 2 branches that both end up at the end tile
        }
    }
}

//checkNeighbour is called in the checkCell function, it looks to see if each tile has as neighbour that it can connect to.
//And pushes the values of those tiles to the chainArr.  
function checkNeighbour(gridRef) {

    //console.log("checkNeighbour has been called")
    // Get neighboring cells
    let neighbours = {
        top: getPreviousLetter(gridRef.charAt(0)),
        bottom: getNextLetter(gridRef.charAt(0)),
        left: parseInt(gridRef.charAt(1)) - 1,
        right: parseInt(gridRef.charAt(1)) + 1,
    };

    // Turn the neighbor cell values into gridRefs
    let cellAbove = neighbours.top + gridRef.charAt(1);
    let cellBelow = neighbours.bottom + gridRef.charAt(1);
    let cellToLeft = gridRef.charAt(0) + neighbours.left;
    let cellToRight = gridRef.charAt(0) + neighbours.right;

    // Make sure the neighbor cells are valid (e.g., within bounds)
    let validCells = [cellAbove, cellBelow, cellToLeft, cellToRight].filter(cell => {
        return cell.length === 2 &&
            cell.charAt(0) >= 'A' && cell.charAt(0) <= 'E' &&
            parseInt(cell.charAt(1)) >= 1 && parseInt(cell.charAt(1)) <= 5;
    });

    //checks each surrounding cell of the current one (with the cell value being passed into the function by gridref)
    validCells.forEach(cell => {
        //The find() method returns the value of the first element that passes a test.
        //The find() method executes a function for each array element.
        let matchingShape = shapes.find(shape => shape.currentCell === cell && !chainArr.includes(cell));

        if (matchingShape && canConnect(gridRef, cell)) {
            chainArr.push(cell); // Add to the chainArr

            isLED(cell);
            // Recursively check this cell's neighbours
            checkNeighbour(cell);
        }
    });

    // After recursion completes and the chainArr is populated, update the tileConnections object using the separate function
    updateTileConnections(chainArr, tileConnections);
    if (chainArr.length > 0) {
    //console.log("chainArr from the checkNeighbours func", chainArr);
    //console.log("tileConnections from the checkNeighbours func", tileConnections);
    }
}

//this function takes the chainArr and checks every cell it contains to see if they have valid neighbours to connect to. 
//the tile and it's connections are then passed to the tileConnections obj. 
function updateTileConnections(chainArr, tileConnections) {
    //The forEach() method calls a function for each element in an array
    //Checks if the current cell contains a tile
    //The some() method checks if any array elements pass a test (provided as a callback function).
    //The some() method executes the callback function once for each array element.
    //The some() method returns true (and stops) if the function returns true for one of the array elements.
    //The some() method returns false if the function returns false for all of the array elements.
    chainArr.forEach(gridRef => {

        let hasTile = shapes.some(shape => shape.currentCell === gridRef);
        if (!hasTile) {
            return; // Skip cells that don't contain tiles
        }

        // Get neighboring cells from chainArr
        let neighbours = {
            top: getPreviousLetter(gridRef.charAt(0)),
            bottom: getNextLetter(gridRef.charAt(0)),
            left: parseInt(gridRef.charAt(1)) - 1,
            right: parseInt(gridRef.charAt(1)) + 1,
        };

        let cellAbove = neighbours.top + gridRef.charAt(1);
        let cellBelow = neighbours.bottom + gridRef.charAt(1);
        let cellToLeft = gridRef.charAt(0) + neighbours.left;
        let cellToRight = gridRef.charAt(0) + neighbours.right;

        let validCells = [cellAbove, cellBelow, cellToLeft, cellToRight].filter(cell => {
            // Ensure the cell is within valid bounds, contains a tile, and can connect
            return cell.length === 2 &&
                cell.charAt(0) >= 'A' && cell.charAt(0) <= 'E' &&
                parseInt(cell.charAt(1)) >= 1 && parseInt(cell.charAt(1)) <= 5 &&
                shapes.some(shape => shape.currentCell === cell) && // Only include cells with tiles
                canConnect(gridRef, cell); // Check if the tiles can connect
        });

        validCells.forEach(cell => {
            // Initialize tileConnections for both tiles if not already present
            if (!tileConnections[gridRef]) {
                tileConnections[gridRef] = [];
            }
            if (!tileConnections[cell]) {
                tileConnections[cell] = [];
            }

            // Add each other to their connection arrays if not already connected
            if (!tileConnections[gridRef].includes(cell)) {
                tileConnections[gridRef].push(cell);
            }
            if (!tileConnections[cell].includes(gridRef)) {
                tileConnections[cell].push(gridRef);
            }
        });
    });
}

//console.log("chainArr",chainArr)
//checkForStartingCell(chainArr); 

//if canConnect then this function returns true, if the tile can't connect then it returns false
//it is called by the checkNeighbour function. 
function canConnect(gridRef, neighbourCell) {
    //console.log("canConnect has run");

    let currentShape = shapes.find(shape => shape.currentCell === gridRef);
    neighbourShape = shapes.find(shape => shape.currentCell === neighbourCell);

    if (!currentShape || !neighbourShape) {
        return false;
    }

    let gridRefRow = gridRef.charAt(0);
    let gridRefCol = parseInt(gridRef.charAt(1));
    let neighbourRow = neighbourCell.charAt(0);
    let neighbourCol = parseInt(neighbourCell.charAt(1));

    // Determine the direction of the neighbour relative to the current cell
    if (neighbourRow === getPreviousLetter(gridRefRow) && neighbourCol === gridRefCol) {
        // Above
        return currentShape.type.top && neighbourShape.type.bottom;
    } else if (neighbourRow === getNextLetter(gridRefRow) && neighbourCol === gridRefCol) {
        // Below
        return currentShape.type.bottom && neighbourShape.type.top;
    } else if (neighbourRow === gridRefRow && neighbourCol === gridRefCol - 1) {
        // Left
        return currentShape.type.left && neighbourShape.type.right;
    } else if (neighbourRow === gridRefRow && neighbourCol === gridRefCol + 1) {
        // Right
        return currentShape.type.right && neighbourShape.type.left;
    }
    return false;
}

//check for dead branches is called. 
//This looks for tiles with only a single connection, it removes these and any incidence of them from the 'tileConnections' array. 
//It then iterates through a do while loop until no more keys are pushed to the dead tile array. 
//It creates an array of dead branch tiles to be removed. This is then passed to the drawTiles func 

function checkForDeadBranches() {
    let haveKeysBeenPushed = false;  // Moved outside the loop

    if (Object.keys(tileConnections).length > 0) {

        //The do...while statements combo defines a code block to be executed once, and repeated as long as a condition is true.
        do {
            haveKeysBeenPushed = false;  // Reset to false at the beginning of the loop

            //Iterate through the keys in tileConnections
            Object.keys(tileConnections).forEach(key => {
                if (tileConnections[key].length < 2 && key !== "A3" && key !== "E3") {
                    keysToDelete.push(key);
                    haveKeysBeenPushed = true;  // Only set to true if a key is actually pushed
                }
            });

            //Filter connections to remove any value that matches a key in keysToDelete
            Object.keys(tileConnections).forEach(key => {
                tileConnections[key] = tileConnections[key].filter(connection => !keysToDelete.includes(connection));
            });

            //Remove keys from the tileConnections object
            keysToDelete.forEach(key => {
                delete tileConnections[key];
            });

        } while (haveKeysBeenPushed);  // Continue the loop if any keys were pushed

        // Update the chainArr without dead branches once the do/while loop has finished
        let chainArrWithOutDeadBranches = chainArr.filter(arrayElement => !keysToDelete.includes(arrayElement));
        chainArr = chainArrWithOutDeadBranches;
    }
}

//runs once the recursive check neighbour function has run. 
//runs to see if the start tile and end tile exists in the array
function checkForStartingCell(chainArr) {

    //console.log("check for starting cell has been called")
    //remove dead branches by finding each tile with <2 connections (excluding A3 and E3)
    checkForDeadBranches();
    if (chainArr.length > 0) {
    console.log("Chain Arr from check for starting cell", chainArr);
    //console.log("chain array called in the 'checkForStartingCell function", chainArr);
    }
    //checks to see if the circuit has a beginning and an end. 
    if (chainArr.includes('A3') && chainArr.includes('E3')) {
        //console.log("Valid circuit");
        //console.log("chainArr =", chainArr);
        changeTileToLive(); // this is the only place where this function is called.
    }

    //if the chainArr does not include A3 and E3 then all of it will be dead
    if (!chainArr.includes('A3' || 'E3')) { //changed from && to ||
        //console.log("not a valid circuit")
        // console.log("valid circuit =", validCircuit);
        //If the chain array doesn't include A3 then empty the chainArr and mark the whole circuit as dead
        chainArr = [];
        //console.log("chainArr cleared as no A3 or E3", chainArr);
        changeTileToDead();
    }
}

//These functions replace the target of the imgSrc for tiles before the tiles are drawn. 

function changeTileToLive() {

    // iterates through shapes and checks and if the current shape matches it changes the image 
    // if the values in the chainArr match a cell's currentCell property then run this function. 
    //console.log("ChainArr called in the changeTileToLive func", chainArr)
    //console.log("shapes array passed to changeTileToLive func", shapes) //holds all the shapes in the current live array
    //shows that the imgSrc of the tiles is live even if they are not render as live. Which is strange! 

    for (let shape of shapes) {

        // if statement to see if the currentCell property matches any of the values in the chainArr array. 
        // if not ignore the tile and check the others. 

        if (chainArr.includes(shape.currentCell)) {

            if (shape.imgSrc == 'img/r_angle_dead_1.jpg') {
                shape.imgSrc = 'img/r_angle_live_1.jpg'
            }
            if (shape.imgSrc == 'img/r_angle_dead_2.jpg') {
                shape.imgSrc = 'img/r_angle_live_2.jpg'
            }
            if (shape.imgSrc == 'img/r_angle_dead_3.jpg') {
                shape.imgSrc = 'img/r_angle_live_3.jpg'
            }
            if (shape.imgSrc == 'img/r_angle_dead_4.jpg') {
                shape.imgSrc = 'img/r_angle_live_4.jpg'
            }
            if (shape.imgSrc == 'img/lambda_dead.jpg') {
                shape.imgSrc = 'img/lambda_live.jpg'
            }
            if (shape.imgSrc == 'img/straight_vert_dead.jpg') {
                shape.imgSrc = 'img/straight_vert_live.jpg'
            }
            if (shape.imgSrc == 'img/straight_hrz_dead.jpg') {
                shape.imgSrc = 'img/straight_hrz_live.jpg'
            }
            if (shape.imgSrc == 'img/led_dead_1.jpg') {
                shape.imgSrc = 'img/led_live_1.jpg'
            }
            if (shape.imgSrc == 'img/led_dead_2.jpg') {
                shape.imgSrc = 'img/led_live_2.jpg'
            }
            if (shape.imgSrc == 'img/led_dead_3.jpg') {
                shape.imgSrc = 'img/led_live_3.jpg'
            }
            if (shape.imgSrc == 'img/led_dead_4.jpg') {
                shape.imgSrc = 'img/led_live_4.jpg'
            }
            if (shape.imgSrc == 'img/T_section_dead_1.jpg') {
                shape.imgSrc = 'img/T_section_live_1.jpg'
            }
            if (shape.imgSrc == 'img/T_section_dead_2.jpg') {
                shape.imgSrc = 'img/T_section_live_2.jpg'
            }
            if (shape.imgSrc == 'img/T_section_dead_3.jpg') {
                shape.imgSrc = 'img/T_section_live_3.jpg'
            }
            if (shape.imgSrc == 'img/T_section_dead_4.jpg') {
                shape.imgSrc = 'img/T_section_live_4.jpg'
            }
            if (shape.imgSrc == 'img/corner_LED_dead_AC_1.jpg') {
                shape.imgSrc = 'img/corner_LED_live_AC_1.jpg'
            }
            if (shape.imgSrc == 'img/corner_LED_dead_AC_2.jpg') {
                shape.imgSrc = 'img/corner_LED_live_AC_2.jpg'
            }
            if (shape.imgSrc == 'img/corner_LED_dead_AC_3.jpg') {
                shape.imgSrc = 'img/corner_LED_live_AC_3.jpg'
            }
            if (shape.imgSrc == 'img/corner_LED_dead_AC_4.jpg') {
                shape.imgSrc = 'img/corner_LED_live_AC_4.jpg'
            }
            if (shape.imgSrc == 'img/corner_LED_dead_CW_1.jpg') {
                shape.imgSrc = 'img/corner_LED_live_CW_1.jpg'
            }
            if (shape.imgSrc == 'img/corner_LED_dead_CW_2.jpg') {
                shape.imgSrc = 'img/corner_LED_live_CW_2.jpg'
            }
            if (shape.imgSrc == 'img/corner_LED_dead_CW_3.jpg') {
                shape.imgSrc = 'img/corner_LED_live_CW_3.jpg'
            }
            if (shape.imgSrc == 'img/corner_LED_dead_CW_4.jpg') {
                shape.imgSrc = 'img/corner_LED_live_CW_4.jpg'
            }
            //console.log(shape.imgSrc, shape.currentCell)
        }
    }
    //if check connection returns true then replace the dead tile with a live one. 
    loadImages(shapes, drawShapes);
}

function changeTileToDead() {

    //console.log("ChainArr called in the changeTileToDead func", chainArr)
    //console.log("shapes array passed to changeTileToDead func", shapes) 
    //console.log("ChangeTileToDead function being called")
    for (let shape of shapes) {
        if (!chainArr.includes(shape.currentCell)) {
            //only apply this function to shapes NOT in the current array.If the chainArr has been cleared then all shapes should be changed to a dead imgSrc

            if (shape.imgSrc == 'img/r_angle_live_1.jpg') {
                shape.imgSrc = 'img/r_angle_dead_1.jpg';
            }
            if (shape.imgSrc == 'img/r_angle_live_2.jpg') {
                shape.imgSrc = 'img/r_angle_dead_2.jpg';
            }
            if (shape.imgSrc == 'img/r_angle_live_3.jpg') {
                shape.imgSrc = 'img/r_angle_dead_3.jpg';
            }
            if (shape.imgSrc == 'img/r_angle_live_4.jpg') {
                shape.imgSrc = 'img/r_angle_dead_4.jpg';
            }
            if (shape.imgSrc == 'img/lambda_live.jpg') {
                shape.imgSrc = 'img/lambda_dead.jpg'
            }
            if (shape.imgSrc == 'img/straight_vert_live.jpg') {
                shape.imgSrc = 'img/straight_vert_dead.jpg'
            }
            if (shape.imgSrc == 'img/straight_hrz_live.jpg') {
                shape.imgSrc = 'img/straight_hrz_dead.jpg'
            }
            if (shape.imgSrc == 'img/led_live_1.jpg') {
                shape.imgSrc = 'img/led_dead_1.jpg'
            }
            if (shape.imgSrc == 'img/led_live_2.jpg') {
                shape.imgSrc = 'img/led_dead_2.jpg'
            }
            if (shape.imgSrc == 'img/led_live_3.jpg') {
                shape.imgSrc = 'img/led_dead_3.jpg'
            }
            if (shape.imgSrc == 'img/led_live_4.jpg') {
                shape.imgSrc = 'img/led_dead_4.jpg'
            }
            if (shape.imgSrc == 'img/T_section_live_1.jpg') {
                shape.imgSrc = 'img/T_section_dead_1.jpg'
            }
            if (shape.imgSrc == 'img/T_section_live_2.jpg') {
                shape.imgSrc = 'img/T_section_dead_2.jpg'
            }
            if (shape.imgSrc == 'img/T_section_live_3.jpg') {
                shape.imgSrc = 'img/T_section_dead_3.jpg'
            }
            if (shape.imgSrc == 'img/T_section_live_4.jpg') {
                shape.imgSrc = 'img/T_section_dead_4.jpg'
            }
            if (shape.imgSrc == 'img/corner_LED_live_AC_1.jpg') {
                shape.imgSrc = 'img/corner_LED_dead_AC_1.jpg'
            }
            if (shape.imgSrc == 'img/corner_LED_live_AC_2.jpg') {
                shape.imgSrc = 'img/corner_LED_dead_AC_2.jpg'
            }
            if (shape.imgSrc == 'img/corner_LED_live_AC_3.jpg') {
                shape.imgSrc = 'img/corner_LED_dead_AC_3.jpg'
            }
            if (shape.imgSrc == 'img/corner_LED_live_AC_4.jpg') {
                shape.imgSrc = 'img/corner_LED_dead_AC_4.jpg'
            }
            if (shape.imgSrc == 'img/corner_LED_live_CW_1.jpg') {
                shape.imgSrc = 'img/corner_LED_dead_CW_1.jpg'
            }
            if (shape.imgSrc == 'img/corner_LED_live_CW_2.jpg') {
                shape.imgSrc = 'img/corner_LED_dead_CW_2.jpg'
            }
            if (shape.imgSrc == 'img/corner_LED_live_CW_3.jpg') {
                shape.imgSrc = 'img/corner_LED_dead_CW_3.jpg'
            }
            if (shape.imgSrc == 'img/corner_LED_live_CW_4.jpg') {
                shape.imgSrc = 'img/corner_LED_dead_CW_4.jpg'
            }
            //console.log(shape.imgSrc, shape.currentCell)
        }
    }
    //if check connection returns false then replace the dead tile with a dead one. 
    loadImages(shapes, drawShapes);
}

//Glossary of methods:
//.forEach
//.some
//.includes
//.charAr
//.push
//.onload
//.drawImage
//.filter
//.unshift
//object.keys
//.fromCharCode
//.save
//.sqrt
//.getContext
//.splice
//Other bits:
//Arrow functions ( =>)
//for (let thing of things) {}
//iteration through objects and arrays
//Do while loop
//ternary

//https://medium.com/@mandeepkaur1/a-list-of-javascript-array-methods-145d09dd19a0
// https://www.youtube.com/watch?v=7PYvx8u_9Sk&ab_channel=BananaCoding