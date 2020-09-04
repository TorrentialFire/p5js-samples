
/* #region  Declarations */

/**
 * Varables (these can change during runtime)
 */
var time;
var diaOmega;
var quarterCanvas;
var canvasCenterX;
var canvasCenterY;

var radii = [];
var omegas = [];

// Boolean which controls drawing the background (first frame or reset).
var firstFrame = true;

// Store the canvas and current simulation frame count (used to save an image).
var canvas;
var simulationFrames;

// Boolean which controls the execution of the draw() function ("pause" feature).
var simulationPaused;

/**
 * CONSTANTS (these cannot change during runtime)
 */
const MAX_DIA = 80;
const MIN_DIA = 20;

/* #endregion */

/* #region  Functions */

/**
 * Resets variables when the window resizes and sets them when called in setup(). 
 */
function resetSimulation() {
    /**
     * By default, the simulation runs immediately on loading/reset, set this
     * to false to pause before drawing the first frame.
     */
    simulationPaused = false;
    advanceFrame = false;

    /**
     * We set simulation frame count equal to 0 here, so every time we reset 
     * our simlation, the frames will start from 0 again. 
     * 
     * We increment the frameCount by 1 in each call to draw().
     */
    simulationFrames = 0;
    firstFrame = true;
    time = 0;
    diaOmega = 2 * PI / 4000;

    /**
     * Periodic frequency, omega (in Hz), of a periodic wave (sin or cos) is 
     * equal to 2 * PI / T, where T is the period of the motion (in milliseconds). 
     * 
     * omega = 2 * PI / T
     * 
     * Periodic waves are functions of the form:
     * a(t) = Amplitude * sin( omega * time ) + Offset
     */

    var sm = min(windowWidth, windowHeight); 
    radii = [
        sm / 4,
        sm / 5,
        sm / 7,
        sm / 19,
        sm / 37
    ];

    omegas = [];
    omegas.push(TWO_PI / 20351);
    omegas.push(TWO_PI / 12829);
    omegas.push(TWO_PI / (4211) * sqrt(2));
    omegas.push(TWO_PI / 2932);
    omegas.push(TWO_PI / (1102) * sqrt(3));

    /**
     * Calculate the center of the canvas to use with translate() in draw() to
     * set the origin.
     */
    canvasCenterX = windowWidth / 2;
    canvasCenterY = windowHeight / 2;

    /**
     * Arbitrary amplitude (maximum) of the oscillation.
     */
    quarterCanvas = min(windowWidth / 4, windowHeight / 4);

    /**
     * Set all our trigonometry to use radians instead of degrees.
     */
    angleMode(RADIANS);
}

function setup() {
    /**
     * We now assign the return value from the createCanvas() function to the
     * canvas variable (needed to save an image from the canvas).
     * See mousePressed() below.
     */
    canvas = createCanvas(windowWidth, windowHeight);
    resetSimulation();
}

function windowResized() {
    /** 
     * We reassign the canvas variable when it's resized.
     */
    canvas = resizeCanvas(windowWidth, windowHeight);
    resetSimulation();
}

/**
 * This function mutates the simulationPaused global value (which is a boolean),
 * using an assignment operator '=' with the negation operator '!' to toggle the
 * simulationPaused variable.
 */
function toggleSimulationPaused() {
    simulationPaused = !simulationPaused;
}

/**
 * This function switches the state of the window between fullscreen and not
 * using the p5.js built-in function fullscreen().
 */
function toggleFullscreen() {
    var fs = fullscreen();
    fullscreen(!fs);
}

/**
 * This function will pause the simulation if it is currently running and will
 * prompt the user to save the current frame. It uses our toggleSimulationPaused()
 * function and a built-in p5.js function, saveCanvas().
 */
function captureCanvas() {

    if (!simulationPaused) {
        toggleSimulationPaused();
    }

    /**
     * Reference for saveCanvas():
     * https://p5js.org/reference/#/p5/saveCanvas
     */
    saveCanvas(canvas, 'frame_' + frameCount, '.png');
}

/**
 * Reference for keyPressed():
 * https://p5js.org/reference/#/p5/keyPressed
 */
function keyPressed() {
    /**
     * Set to true to prevent the default JS handling of key events.
     * Note, the return statement at the bottom of the function uses the
     * boolean negate operator to invert this variable. From the p5.js 
     * documentation for keyPressed(), the function should return false if the
     * user wishes to prevent the default event handling of JS. 
     */
    var preventDefault = false;

    /**
     * Useful logging when finding key code values.
     */
    //console.log('KeyPressed, code: ' + keyCode);

    // The "key" number for space bar is 32
    if (keyCode === 32) { // key 'space'
        toggleSimulationPaused();
        preventDefault = true;
    } else if (keyCode === 190) { // key '.'
        if (simulationPaused) {
            advanceFrame = true;
            preventDefault = true;
        }
    } else if (keyCode === 82) { // key 'r'
        resetSimulation();
        preventDefault = true;
    } else if (keyCode === 70) { // key 'f'
        toggleFullscreen();
        preventDefault = true;
    } else if (keyCode === 67) { // key 'c'
        captureCanvas();
        preventDefault = true;
    }

    return !preventDefault;
}
/* #endregion */

/* #region  Render */

/**
 * The draw() function draws one "frame" of the canvas. To animate the canvas
 * we simply change aspects of what we are drawing on each frame using
 * variables.
 */
function draw() {

    // Advance the frame if the simulation is running or the user advances the frame.
    if (!simulationPaused || advanceFrame) {
        advanceFrame = false;

        /**
         * Only draw the background when the program starts or resetSimulation()
         * is called. 
         */
        if (firstFrame == true) {
            background(20, 20, 20);
            firstFrame = false;
        }

        /**
         * Reference for translate:
         * https://p5js.org/reference/#/p5/translate
         * 
         * In order to draw relative to the center of the canvas, we call translate
         * here to move the "origin" of the drawing to the center of the canvas.
         * We recalculate these values every time resetSimulation() is called.
         */
        translate(canvasCenterX, canvasCenterY);

        /**
         * Reference for scale():
         * https://p5js.org/reference/#/p5/scale
         * 
         * Scaling by negative 1 has the effect of flipping the direction of
         * the axis. In 2-D, scale takes 2 arguments, scale(x, y). Here we have
         * to specify decimal numbers, but just 1.0 and -1.0 in order to make 
         * "up" and the positive y-axis correspond.
         */
        scale(1.0, -1.0);
        
        push();
        for (var i = 0; i < radii.length; i++) {
            rotate(omegas[i] * time);
            translate(radii[i], 0);
        }

        /**
         * These two local variables calculate the x and y position of the center
         * of the colored circle which we are about to draw.
         */
        //var x = quarterCanvas * cos(omega3 * time);
        //var y = quarterCanvas * sin(omega2 * time);

        var dia = (MAX_DIA - MIN_DIA) * ((sin(diaOmega * time) + 1) / 2) + MIN_DIA;
        
        /**
         * Hue wraps red-to-red (0 is red, 360 is red), so we can use
         * linear-interpolation (lerp) to smoothly move from 0 to 360, this has
         * the effect of gradually changing the color through all of the fully
         * saturated hues in the color gamut.
         * 
         * If you want to lerp colors along more than one parameter (like lerping
         * RGB colors), see: https://p5js.org/reference/#/p5/lerpColor
         */
        var hue = lerp(0, 360, (time % 10001) / 10000.0);
        colorMode(HSB);
        noStroke();
        fill(hue, 100, 100);
        circle(0, 0, dia);

        pop();

        /**
         * Reset the color mode state.
         */
        colorMode(RGB)

        /**
         * Simulate time passing...
         */
        time += deltaTime;
        simulationFrames++;
    }
}
/* #endregion */