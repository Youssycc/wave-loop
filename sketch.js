
//------------PROJECT DEFAULT VARIABLES------------//
//canvas dimensions
var g = 0;
var c = 0;
var q = 0;
var v = 0;

//CC
const captureRun = true; //set to true to capture
const duration = 100; //duration of capture in frames
const fps = 30;
var capturer = new CCapture({ format: 'png', framerate: fps });
var startMillis;

//------------PROJECT SPECIAL VARIABLES------------//
let circleRadius, cellDimension;
const NUMFRAMES = 50;
var t;


//------------CODE----------------+//

function setup() {
    setupGrid(1);
    createCanvas(g, g);
    pixelDensity(4.0);
    circleRadius = q;
    cellDimension = c / 5;
    frameRate(30)
}

function draw() {

    //----------SETTING UP CAPTURE---------//
    //compute t
    t = (frameCount % NUMFRAMES) / (NUMFRAMES);

    if (captureRun) {
        setCapture();
    }

    //----------DRAWING CODE GOES HERE---------//
    background("#048ABF");


    //draw the lines
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
            const x = i * cellDimension;
            const y = j * cellDimension;
            const scale = map(dist(x, y, 0, 0), 0, sqrt(2) * g, 0, 1);
            const dy = map(periodicFunction(t - offset(x, y)), -1, 1, -.9 * cellDimension, .9 * cellDimension) * pow(scale, 3);
            fill(fillColor(x, y))
            circle(x, y + dy, map(periodicFunction(t - offset(x, y)), -1, 1, circleRadius, circleRadius / 2));
        }
    }
}

function drawLines() {
    for (let i = 0; i <= g / cellDimension; i++) {
        for (let j = 0; j <= g / cellDimension; j++) {
            const x = i * cellDimension;
            const y = j * cellDimension;
            push();
            translate(x, y);
            const p = periodicFunction(t - offset(x, y));
            const weight = map(abs(p), 0, 1, 0, q / 3);
            rotate(p);
            stroke(strokeColor(x, y));
            strokeWeight(weight);
            line(-lineWidth / 2, 0, lineWidth / 2, 0);
            pop();

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
    if (frameCount === 0) {
        capturer.start();
    }

    if (frameCount == duration) {
        noLoop()
    }


}

function captureFrame() {
    console.log('capturing frame ' + frameCount);
    capturer.capture(document.getElementById('defaultCanvas0'));

    if (frameCount > duration) {
        console.log('finished recording.');
        capturer.stop();
        capturer.save();
        return;
    }
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



