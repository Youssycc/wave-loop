
//------------PROJECT DEFAULT VARIABLES------------//
//canvas dimensions
var g = 0;
var c = 0;
var q = 0;
var v = 0;

//CC
const captureRun = false; //set to true to capture
const duration = 100; //duration of capture in frames
const fps = 30;
var capturer = new CCapture({ format: 'png', framerate: fps });

//------------PROJECT SPECIAL VARIABLES------------//
let circleRadius, cellDimension;
const loopDuration = 50; //duration of loop in frames
var t;


//------------CODE----------------+//

function setup() {
    setupGrid(1);
    createCanvas(g, g);
    circleRadius = q; //radius of the circles
    cellDimension = c / 5; //dimension of the cells of the grid on which circles are positionned
    frameRate(30)
}

function draw() {

    //----------SETTING UP CAPTURE---------//
    //compute t, the progress through the animation loop
    t = (frameCount % loopDuration) / (loopDuration);

    if (captureRun) {
        setCapture();
    }

    //----------DRAWING CODE GOES HERE---------//
    background("#048ABF");
    //draw the circles
    drawCircles();

    //----------CAPTURING EACH DRAW FRAME---------//
    if (captureRun) {
        captureFrame();
    }
}


function setupGrid(m) {
    g = min(windowWidth, windowHeight) * m;
    c = g / 10;
    q = g / 100;
    v = g / 1000;
}

//-------------PROJECT SPECIFIC FUNCTIONS---------------//

//draw circles on a grid
//animate using an offset on dy, radius and fillcolor
function drawCircles() {
    noStroke();
    for (let i = 0; i <= g / cellDimension; i++) {
        for (let j = 0; j <= g / cellDimension; j++) {
            const x = i * cellDimension; //x position of circle
            const y = j * cellDimension; //y position of circle
            
            //compute the scale of the displacement of each circle on the y axis
            //the displacement gets bigger when the circle is the furthest away from the top-left corner
            const scale = map(dist(x, y, 0, 0), 0, sqrt(2) * g, 0, 1);

            //compute the final displacement using the periodicFunction for looping
            const dy = map(periodicFunction(t - offset(x, y)), -1, 1, -.9 * cellDimension, .9 * cellDimension) * pow(scale, 3);

            //drawing the circle
            // the radius size also evolves just proportionnally with the displacement dy
            const radius = map(periodicFunction(t - offset(x, y)), -1, 1, circleRadius, circleRadius / 2)
            
            //the color gets whiter as dots are further away from the top-left corner
            fill(fillColor(x, y))
            circle(x, y + dy, radius);
        }
    }
}

function fillColor(x, y) {
    const from = color("#048ABF");
    const to = color("#FFFFFF");
    const amt = pow(dist(x, y, 0, 0) / (g * sqrt(2)), 1.5);
    return lerpColor(from, to, amt);
}


//must have a period of 1
function periodicFunction(p) {
    return sin(TWO_PI * p);
}

//offset of the animation, function of x,y coordinates in space
function offset(x, y) {
    return .005 * (x + 2 * y);
}





//-------------ALL PROJECT FUNCTIONS---------------//
function setCapture() {
    if (frameCount === 1) {
        capturer.start();
    }

    if (frameCount == duration+2) {
        noLoop();
        console.log('finished recording.');
        console.log(capturer)
        capturer.stop();
        capturer.save();
        return;
    }
}

function captureFrame() {
    console.log('capturing frame ' + frameCount);
    capturer.capture(document.getElementById('defaultCanvas0'));

}

function keyPressed() {
    if (key == 's' || key == 'S') {
        setupGrid(5);
        resizeCanvas(g, g);
        saveCanvas('youssycc_' + seed, 'png');
    }
}


//function to draw from array of options following a optional distribution
function diceRoll(options, probabilities = false) {
    const roll = random();
    let index;
    if (!probabilities) {
        //uniformly draw from the options
        index = floor(map(roll, 0, 1, 0, options.length));
    } else {
        //follow a distinct probability scheme
        for (let i = 0; i < probabilities.length - 1; i++) {
            if (roll >= probabilities[i] && roll < probabilities[i + 1]) {
                index = i;
                break;
            }
        }
    }
    return options[index];
}

//function to draw from paper shape
function drawFromPaperSegments(segments) {
    beginShape();
    vertex(segments[0].point.x, segments[0].point.y);
    for (let s = 1; s < segments.length; s++) {
        bezierVertex(segments[s - 1].handleOut.x + segments[s - 1].point.x, segments[s - 1].handleOut.y + segments[s - 1].point.y,
            segments[s].handleIn.x + segments[s].point.x, segments[s].handleIn.y + segments[s].point.y,
            segments[s].point.x, segments[s].point.y);

    }
    bezierVertex(segments[segments.length - 1].handleOut.x + segments[segments.length - 1].point.x, segments[segments.length - 1].handleOut.y + segments[segments.length - 1].point.y,
        segments[0].handleIn.x + segments[0].point.x, segments[0].handleIn.y + segments[0].point.y,
        segments[0].point.x, segments[0].point.y);
    endShape();
}



