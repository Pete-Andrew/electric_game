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

let zoneStartX;
let zoneStartY;

let gridRef;

//JavaScript callback is a function which is to be executed after another function has finished execution
//A callback is a function passed as an argument to another function. This technique allows a function to call another function
//A callback function can run after another function has finished

function loadImage(src, callback) {
    //creates a new HTML Image element/image object using the 'new Image()' constructor.
    const img = new Image();
    //"img.onload" is an event handler that gets called when the image has finished loading successfully. The arrow function "() => callback(img)" is assigned to img.onload. 
    //This means that when the image has loaded, the function callback will be called with img (the loaded image object) as its argument.
    img.onload = () => callback(img);
    //sets the src attribute of the img object to the provided src argument. Setting img.src starts the process of loading the image from the specified URL.
    img.src = src;
}
 
//holds shapes as an array
let shapes = [];
let isDragging = false;
//sets a tile type for looking at neighbouring tiles
let tileType = {
    straight:{ top: true,  right: false, bottom: true,  left: false }, 
    power:   { top: false, right: false, bottom: true,  left: false }, 
    rAngle1: { top: false, right: false, bottom: true,  left: true },
    rAngle2: { top: true,  right: false, bottom: false, left: true },
    rAngle3: { top: true,  right: true,  bottom: false, left: false },
    rAngle4: { top: false, right: true,  bottom: true,  left: false },
}

let currentShapesIndex = null;
// x and y declare where in the canvas the shapes are going to be drawn
//shapes.push({ x: 140, y: 20, width: 40, height: 40, color: 'green', shapeIndex: 0}); //shape to hold the rotate button

shapes.push({ x: 400, y: 0,   width: 200, height: 200, color: 'green', imgSrc:'img/power.jpg',           type: tileType.power,    cellName:'power',     currentCell: 'A3', lastCellValue: '',   canMove: false});
shapes.push({ x: 200, y: 600, width: 200, height: 200, color: 'red', imgSrc:'img/r_angle_dead_1.jpg',    type: tileType.rAngle1,  cellName:'r_angle_1', currentCell: 'D2', lastCellValue: '',  canMove: true,  });
shapes.push({ x: 400, y: 400, width: 200, height: 200, color: 'yellow', imgSrc:'img/r_angle_dead_2.jpg', type: tileType.rAngle2,  cellName:'r_angle_2', currentCell: 'C3', lastCellValue: '',  canMove: true, });
shapes.push({ x: 0,   y: 0,   width: 200, height: 200, color: 'blue', imgSrc:'img/r_angle_dead_3.jpg',   type: tileType.rAngle3,  cellName:'r_angle_3', currentCell: 'A1', lastCellValue: '',  canMove: true, });
shapes.push({ x: 200, y: 200, width: 200, height: 200, color: 'green', imgSrc:'img/r_angle_dead_4.jpg',  type: tileType.rAngle4,  cellName:'r_angle_4', currentCell: 'B2', lastCellValue: '',  canMove: true, });

//need to understand this better..... 
function loadImages(shapes, callback) {
    let loadedCount = 0;
    shapes.forEach(shape => {
        if (shape.imgSrc) { //checks to see if a given shape has an imgSrc attribute 
            loadImage(shape.imgSrc, (img) => {  //calls the load image function passing in the imageSrc attribute and.... 
                shape.image = img;
                loadedCount++;
                if (loadedCount === shapes.length) {
                    callback();
                }
            });
        } else {
            loadedCount++;
            if (loadedCount === shapes.length) {
                callback();
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

//for using an image rather than a js drawn grid NOT IN USE CURRENTLY
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
    let squareX = middlePointLocation.x;
    let squareY = middlePointLocation.y;
    let squareRef = { column: 0, row: 0 };
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
    
    // BUG: need to stop the cell from being dropped on a pre-exiting one.
    // Needs to check here if the cellRef matches any of the other tiles. 
    // If it does, return out of the func and do nothing. 
    // need a variable to hold the last cell ref

    //iterates over all tiles and sees if there is an tile with the same cellRef. 
    // compares it against all existing tiles so you get a multiple console log
    for (let shape of shapes) { 
        if (shape.currentCell == cellRef) {
            console.log("overlapping cell!");
            
            //set the tiles co-ordinates to last valid cell
            // sets the currentCell property of the tile to lastCellVal
            shapes[currentShapesIndex].currentCell = lastCellVal;
            console.log("last valid cell", currentShape.currentCell);
            //Need to pass in the values of the last valid cell NOT cell ref
            currentShape.x = cellCoords[lastCellVal].x
            currentShape.y = cellCoords[lastCellVal].y;          
            snapTo();          
            return; //exits the whole function

        }
    }
    
    for (let shape of shapes) {
        if (shape.currentCell !== cellRef)
            console.log("No overlap! Crack on guv'nor");
    }

    // pushes the current cell ref to the tile that is in the cell. 
    shapes[currentShapesIndex].currentCell = cellRef;
    //gridRef holds the value of the cell occupied by the current tile
    gridRef = shapes[currentShapesIndex].currentCell;
    console.log("current tile is in cell", gridRef);
    console.log("previous cell value was", lastCellVal);

    //calls the checkNeighbour func to see if there are surrounding tiles, uses A3 as a start point to iterate from. 
    checkNeighbour('A3');
    // calling the change tile to dead here makes sure that all non-connected tiles are made dead. Argument passed in needs to be the start tile
    // don't use gridRef as a this does not start the chain at the start point but rather the tile that was moved > Breaks the code.
    changeTileToDead();
    
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
        // zoneIndex++; //commented out as not needed?? 
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

//onmousedown these functions are triggered
function mouseDown(e) {
    e.preventDefault();
    mouseDownInZone(e);

    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);

    let index = 0;
    for (let shape of shapes) {
        if (isMouseInShape(startX, startY, shape)) {
            // console.log("in shape === yes");
            currentShapesIndex = index;
            isDragging = true;
            return;
        } else {
            // console.log("in shape === no");
        }
        index++;
    }
};

// mouse up event
function mouseUp(e) {
    if (!isDragging) {
        return;
    } else {
        e.preventDefault();
        findMiddlePoint();
        checkCell(); // This calls checkNeighbour func.
        isDragging = false;

        chainArr = []; //clears the chainArr array so that the array is only filled with current values
        console.log("Chain array cleared");     
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

        drawShapes();
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

// let drawShapes = function(), this an alternative way of declaring this function. Stores the func as a variable.
// Functions stored in variables do not need function names. They are always invoked (called) using the variable name. 
function drawShapes() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawHorizGrid();
    drawVertGrid();
    for (let shape of shapes) {
        if (shape.image) {
                // Draw the image
                context.drawImage(shape.image, shape.x, shape.y, shape.width, shape.height);
        } else {
                // Draw the shape with color (fallback)
                context.fillStyle = shape.color;
                context.fillRect(shape.x, shape.y, shape.width, shape.height);
            }
        }
    }

// Load all shapes (with their relevant images) and then draw the shapes
loadImages(shapes, drawShapes)
   
function snapTo() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawHorizGrid();
    drawVertGrid();
    for (let shape of shapes) {
        if (shape.image) {
            // Draw the image
            context.drawImage(shape.image, shape.x, shape.y, shape.width, shape.height);
    } else {
            // Draw the shape with color (fallback)
            context.fillStyle = shape.color;
            context.fillRect(shape.x, shape.y, shape.width, shape.height);
        }
    }
}

//This part of the code works out what the surrounding letters are to the current cell
//take a letter in as a parameter and return the previous letter
function getPreviousLetter (letter) {
        // Convert the letter to its ASCII code
        const charCode = letter.charCodeAt(0);
        // console.log(charCode)
        // Get the preceding letter by subtracting 1
        const precedingCharCode = charCode - 1; 
        // Convert the ASCII code back to a letter
        const precedingLetter = String.fromCharCode(precedingCharCode)
        return precedingLetter;
}
//take a letter in as a parameter and return the next letter
function getNextLetter (letter) {
            // Convert the letter to its ASCII code
            const charCode = letter.charCodeAt(0);
            // console.log(charCode)
            // Get the next letter by adding 1
            const precedingCharCode = charCode + 1; 
            // Convert the ASCII code back to a letter
            const precedingLetter = String.fromCharCode(precedingCharCode)
            return precedingLetter;
}

//checkNeighbour is called in the checkCell function
function checkNeighbour(gridRef) {
    //console.log("checkNeighbour func has been called for " + gridRef);
    //logs the current cell taken from the objects properties. 
    //console.log("current cell ref =", gridRef)
    //console.log(currentShape.currentCell); // does the same thing as cell ref. 
    // Get neighbouring cells
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

    // Make sure the neighbor cells are valid (e.g., within bounds)
    let validCells = [cellAbove, cellBelow, cellToLeft, cellToRight].filter(cell => {
        return cell.length === 2 && 
               cell.charAt(0) >= 'A' && cell.charAt(0) <= 'E' &&
               parseInt(cell.charAt(1)) >= 1 && parseInt(cell.charAt(1)) <= 5;
    });

    // Check each valid neighbouring cell for possible connections
    validCells.forEach(cell => {
        let matchingShape = shapes.find(shape => shape.currentCell === cell && !chainArr.includes(cell));

        if (matchingShape) {
            // Check if the shapes can connect based on the connection logic
            if (canConnect(gridRef, cell)) {
                // Add the cell to the chain array
                chainArr.push(cell);
                console.log(`Connecting to ${cell}`);
                console.log("chain Array =", chainArr);
                // Recursively check this cell's neighbours
                checkNeighbour(cell);
            }
        }
    }); 

    // Once the recursive function has been run to check the neighbours for each cell the checkForStartingCell func is run to see if A3 is present
    // checks to see if A3 is included in the array
    checkForStartingCell (chainArr); 
}

function canConnect(gridRef, neighbourCell) {
    // Determine the positions around the current cell
    let currentShape = shapes.find(shape => shape.currentCell === gridRef);
    let neighbourShape = shapes.find(shape => shape.currentCell === neighbourCell);

    if (!currentShape || !neighbourShape) {
        return false;
    }

    let gridRefRow = gridRef.charAt(0);
    let gridRefCol = parseInt(gridRef.charAt(1));
    let neighbourRow = neighbourCell.charAt(0);
    let neighbourCol = parseInt(neighbourCell.charAt(1));

    // Determine the direction of the neighbor relative to the current cell
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

function checkForStartingCell (chainArr) {
    
    if (chainArr.includes('A3')) {
        //console.log("Valid circuit");
        //console.log("chainArr =", chainArr);
        changeTileToLive();
    } 
    
    if (!chainArr.includes('A3')) {
        console.log("not a valid circuit")
        // console.log("valid circuit =", validCircuit);
        changeTileToDead();
        //If the chain array doesn't include A3 then mark the whole circuit as dead
        chainArr = [];
    }
}

function changeTileToLive() {

    // iterates through shapes and checks and if the current shape matches it changes the image
    // if the values in the chainArr match a cell's currentCell property then run this function. 
       
    for (let shape of shapes) {
    
        // if statement to see if the currentCell property matches any of the values in the chainArr array. 
        // if not ignore the tile and check the others. 
        
        if(chainArr.includes(shape.currentCell)) {

            if (shape.imgSrc == 'img/r_angle_dead_1.jpg') { 
                shape.imgSrc = 'img/r_angle_live_1.jpg';
            }
            if (shape.imgSrc == 'img/r_angle_dead_2.jpg') {
                shape.imgSrc = 'img/r_angle_live_2.jpg';
            }
            if (shape.imgSrc == 'img/r_angle_dead_3.jpg') {
                shape.imgSrc = 'img/r_angle_live_3.jpg';
            }
            if (shape.imgSrc == 'img/r_angle_dead_4.jpg') {
                shape.imgSrc = 'img/r_angle_live_4.jpg';
            }
       }
    }
        
    //if check connection returns true then replace the dead tile with a live one. 
    loadImages(shapes, drawShapes);
    }

function changeTileToDead () {

        for (let shape of shapes) {

            if(!chainArr.includes(shape.currentCell)) {
            //only apply this function to shapes NOT in the current array.
            
            if (shape.imgSrc == 'img/r_angle_live_1.jpg') {
                shape.imgSrc = 'img/r_angle_dead_1.jpg';
                //turns off the cell and marks connections as false   
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
        }
    }
   
    //if check connection returns false then replace the dead tile with a dead one. 
    loadImages(shapes, drawShapes);   
}

// build an array of tiles IF tile is live, add to the array.
// if a tile is removed from the array remove items after it in the array and clear the   

// https://www.youtube.com/watch?v=7PYvx8u_9Sk&ab_channel=BananaCoding