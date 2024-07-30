let canvas = document.getElementById("canvas");
// 
let context = canvas.getContext("2d");

//fills the screen:
// canvas.width = window.innerWidth - 15;
// canvas.height = window.innerHeight;

//to set it to a px size you don't need speech marks or 'px' at the end.
canvas.width = 1000;
canvas.height = 1000;

canvas.style.border = "5px solid black"

let canvasWidth = canvas.width;
console.log("canvas width = ", canvasWidth);
let canvasHeight = canvas.height;
console.log("canvas height = ", canvasHeight);
let offsetX;
let offsetY;

function getOffset() {
    let canvasOffset = canvas.getBoundingClientRect();
    offsetX = canvasOffset.left;
    offsetY = canvasOffset.top;
}



let shapes = [];
let isDragging = false;

let startX;
let startY;

let currentShapesIndex = null;
// x and y declare where in the canvas the shapes are going to be drawn
shapes.push({x:100, y:100, width: 200, height: 300, color: 'green'});
// shapes.push({x:0, y:0, width: 200, height: 200, color: 'blue'});
// shapes.push({x:100, y:100, width: 3, height: 500, color: 'black'});

let vertGridLines = [];
vertGridLines.push({x:200, y:0, width: 4, height:canvasHeight, color: 'blacK'});
vertGridLines.push({x:400, y:0, width: 4, height:canvasHeight, color: 'blacK'});
vertGridLines.push({x:600, y:0, width: 4, height:canvasHeight, color: 'blacK'});
vertGridLines.push({x:800, y:0, width: 4, height:canvasHeight, color: 'blacK'});


//
function drawVertGrid() {
    context.clearRect(0,0, canvasWidth, canvasHeight);
    for (let vertGridLine of vertGridLines) {
        context.fillStyle = vertGridLine.color;
        context.fillRect(vertGridLine.x, vertGridLine.y, vertGridLine.width, vertGridLine.height)
        // console.log(vertGridLine)
    }
}
drawVertGrid();

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

//onmousedown this function is triggered
function mouseDown (e) {
    e.preventDefault();
    // 
    startX = parseInt(e.clientX);
    startY = parseInt(e.clientY); 

    let index =0;
    for (let shape of shapes ) {
        if (isMouseInShape(startX, startY, shape)) {
            console.log("in shape === yes");
            currentShapesIndex = index;
            isDragging = true;
            return;
        } else {
        console.log("in shape === no");
        }    
        index++;
  }
};

function mouseUp (e) {
    if (!isDragging) {
        return;
    } else {
        e.preventDefault();
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
        let mouseX = parseInt(e.clientX);
        let mouseY = parseInt(e.clientY);

        let mouseMoveDistanceX = mouseX - startX;
        let mouseMoveDistanceY = mouseY - startY;
        // console.log("distance from click, mouse X and mouse Y ", mouseMoveDistanceX, mouseMoveDistanceY)
        let currentShape = shapes[currentShapesIndex];
        // console.log(currentShape);
        currentShape.x += mouseMoveDistanceX;
        currentShape.y += mouseMoveDistanceY;

        drawShapes();
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

//let drawShapes = function(), this an alternative way of declaring this function.
function drawShapes() {
    context.clearRect(0,0, canvasWidth, canvasHeight);
    for (let shape of shapes) {
        context.fillStyle = shape.color;
        context.fillRect(shape.x, shape.y, shape.width, shape.height)

    }
}
drawShapes();





// https://www.youtube.com/watch?v=7PYvx8u_9Sk&ab_channel=BananaCoding