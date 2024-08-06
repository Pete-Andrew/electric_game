let canvas = document.getElementById("canvas");
// .getContent Returns a static collection of nodes representing the flow's source content.
let context = canvas.getContext("2d");
//to set it to a px size you don't need speech marks or 'px' at the end.
canvas.width = 1000;
canvas.height = 1000;

// stores the value for the center of the cube
let middlePointLocation = {x:0, y:0};

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

//holds shapes as an array
let shapes = [];
let isDragging = false;

let currentShapesIndex = null;
// x and y declare where in the canvas the shapes are going to be drawn
shapes.push({x:100, y:100, width: 200, height: 200, color: 'green', shapeIndex: 0});
shapes.push({x:0, y:0, width: 200, height: 200, color: 'blue', shapeIndex: 1});
shapes.push({x:200, y:200, width: 200, height: 200, color: 'red', shapeIndex: 2});

// creates the vertical grid lines array
let vertGridLines = [];
vertGridLines.push({x:200, y:0, width: 4, height:canvasHeight, color: 'blacK'});
vertGridLines.push({x:400, y:0, width: 4, height:canvasHeight, color: 'blacK'});
vertGridLines.push({x:600, y:0, width: 4, height:canvasHeight, color: 'blacK'});
vertGridLines.push({x:800, y:0, width: 4, height:canvasHeight, color: 'blacK'});

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
horizGridLines.push({x:0, y:200, width:canvasWidth, height: 4, color: 'black'})
horizGridLines.push({x:0, y:400, width:canvasWidth, height: 4, color: 'black'})
horizGridLines.push({x:0, y:600, width:canvasWidth, height: 4, color: 'black'})
horizGridLines.push({x:0, y:800, width:canvasWidth, height: 4, color: 'black'})

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
function backgroundCanvasImg () {
    base_image = new Image();
    base_image.src = 'img/fiveByFiveGrid.gif'
    base_image.onload = function() {
        context.drawImage(base_image, 0, 0);
    }
}
// backgroundCanvasImg(); 

// set co-ordinates for the grid squares
let zones = [];
 
// zones.push({x:0, y:0, width: 200, height: 200, zoneName: "a1"})
// OR put in a for loop to set each zone. 
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
console.log("zones ", zones);

//find the middle point of the moving object
function findMiddlePoint() {
    //current shapes index needs to be used here or all the shapes default to the square of the first one.
    middlePointLocation.x = shapes[currentShapesIndex].x + 100;
    middlePointLocation.y = shapes[currentShapesIndex].y +100;
    console.log("middle point location =", middlePointLocation);
}

function checkCell () { 
    let squareX = middlePointLocation.x;  
    let squareY = middlePointLocation.y;
    let squareRef = {column:0, row:0};

    currentShape = shapes[currentShapesIndex];
    // make a nested for loop?
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

    console.log("cell containing the center of the square",squareRef);
    cellRef = `${squareRef.row}${squareRef.column}`
    console.log(cellRef);
//A row
    if (cellRef === "A1") {
        currentShape.x = 0;
        currentShape.y = 0;
    } 
    if (cellRef === "A2") {
        currentShape.x = 200;
        currentShape.y = 0;
    } 
    if (cellRef === "A3") {
        currentShape.x = 400;
        currentShape.y = 0;
    } 
    if (cellRef === "A4") {
        currentShape.x = 600;
        currentShape.y = 0;
    } 
    if (cellRef === "A5") {
        currentShape.x = 800;
        currentShape.y = 0;
    } 
//B row
    if (cellRef === "B1") {
        currentShape.x = 0;
        currentShape.y = 200;
    } 
    if (cellRef === "B2") {
        currentShape.x = 200;
        currentShape.y = 200;
    } 
    if (cellRef === "B3") {
        currentShape.x = 400;
        currentShape.y = 200;
    } 
    if (cellRef === "B4") {
        currentShape.x = 600;
        currentShape.y = 200;
    } 
    if (cellRef === "B5") {
        currentShape.x = 800;
        currentShape.y = 200;}
    snapTo();
    
    
        //updates the value of the shapes x and y co-ordinates
        //need to give the center cell ref co-ordinates

    //console.log ("squareX", squareX, "squareY", squareY);
    //console.log(middlePointLocation);

    //snapping function
}

//X and Y co-ordinates and 'zone' are passed in by the mouseDownInZone function 
function isMouseInZone (x, y, zone) {
    //console.log("mouseInZone has been called");
    //these variables take the values from the for loop in the mouseDownInZone function 
    let zoneLeft = zone.x;
    let zoneRight = zone.x + zone.width;
    let zoneTop = zone.y;
    let zoneBottom = zone.y + zone.height;

    if (x > zoneLeft && x < zoneRight && y > zoneTop && y < zoneBottom) {
        console.log(`is inside zone ${zone.zoneName}`);

        return true;
    } else {
        // console.log("not inside zone");
        return false; 
    }
}

//onmousedown this function is triggered, onmousedown @ line 212 
function mouseDownInZone (e) {   
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

window.onscroll = function() { getOffset();}
window.onresize = function() { getOffset();}
canvas.onresize = function() { getOffset();}


//checks to see if the mouse is inside a shape
function isMouseInShape (x, y, shape) {
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
function mouseDown (e) {
    e.preventDefault();
    mouseDownInZone(e); 

    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY); 

    let index =0;
    for (let shape of shapes ) {
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

function mouseUp (e) {
    if (!isDragging) {
        return;
    } else {
        e.preventDefault();
        findMiddlePoint(e);
        checkCell() //need to pass in the value of the cells

        isDragging = false; 
    }
}

function mouseOut (e) {
    if (!isDragging) {
        return;
    } else {
        e.preventDefault();
        isDragging = false;
    }
}

function mouseMove (e) {
    if(!isDragging) {
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
    // console.log("move");
}

//listens for the mousedown event on the canvas
canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
canvas.onmouseout = mouseOut;
canvas.onmousemove = mouseMove;

function itIsAlive() {
    console.log("it is alive");
}

//let drawShapes = function(), this an alternative way of declaring this function.
function drawShapes() {
    context.clearRect(0,0, canvasWidth, canvasHeight);
    drawHorizGrid();
    drawVertGrid();
    for (let shape of shapes) {
        context.fillStyle = shape.color;
        context.fillRect(shape.x, shape.y, shape.width, shape.height)
    }
}
drawShapes();

function snapTo () {
    context.clearRect(0,0, canvasWidth, canvasHeight);
    drawHorizGrid();
    drawVertGrid();
    for (let shape of shapes) {
        context.fillStyle = shape.color;
        context.fillRect(shape.x, shape.y, shape.width, shape.height)
    }
}




// https://www.youtube.com/watch?v=7PYvx8u_9Sk&ab_channel=BananaCoding