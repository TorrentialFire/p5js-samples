/**
 * Varables (these can change during runtime)
 */

var time;
var omega;
var omega2;
var omega3;
var quarterCanvas;
var canvasCenterX;
var canvasCenterY;

/**
 * Controls drawing the background on the first frame or on resetSimulation() only.
 */
var firstFrame = true;

/**
 * Create a variable for the canvas and the current simulation frame count so 
 * that we can use them to save an image.
 */
var canvas;
var simulationFrames;

/**
 * Create a variable to control the execution of the draw() function, adding a
 * "pause" feature.
 */
var simulationPaused;

/**
 * CONSTANTS (these cannot change during runtime)
 */

const MAX_DIA = 200;
const MIN_DIA = 20;

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
    omega = 2 * PI / 4000;

    /**
     * Periodic frequency, omega (in Hz), of a periodic wave (sin or cos) is 
     * equal to 2 * PI / T, where T is the period of the motion (in milliseconds). 
     * 
     * omega = 2 * PI / T
     * 
     * Periodic waves are functions of the form:
     * a(t) = Amplitude * sin( omega * time ) + Offset
     */

    // A wave with this periodic frequency takes 7 seconds to
    // complete 1 oscillation.
    omega2 = 2 * PI / 7000;

    // A wave with this periodic frequency takes 6.543 seconds to
    // complete 1 oscillation.
    omega3 = 2 * PI / 6543;
    
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
 * using an assignment operator '=' with the negation operator '!'.
 * 
 * The result is that simulation will be the opposite of what it previously was:
 * !false -> true
 * !true  -> false
 */
function toggleSimulationPaused() {
    simulationPaused = !simulationPaused;
}

/**
 * This function switches the state of the window between fullscreen and not
 * using p5.js built-in functions.
 * 
 * Putting this in a function makes it easier to read other code in our script.
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
    /**
     * Before saving, if the simulation is not paused, we pause it.
     */
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
 * 
 * Similar to other functions we have written, such as setup(), windowResized(),
 * and draw(), this function is used as a callback by p5.js.
 * 
 * In this case, when a key is pressed on the keyboard, p5.js will call this 
 * function and its logic will be evaluated.
 */
function keyPressed() {
    /**
     * Working with input/output (IO) typically means handling events. Javascript
     * has default behavior that it uses when a key is pressed, by setting 
     * this preventDefault variable to true, we prevent JS from using it's default
     * behavior for the key press. We are essentially telling the language that
     * we dealt with the key press and nothing else needs to be done.
     */
    var preventDefault = false;
    
    /**
     * This console log is useful for figuring out which key "code" goes with
     * a given key. Uncomment this function and press the key you want to learn
     * the key code for. Press "Ctrl + Shift + I" in the web browser (Chrome,
     * Firefox, etc.) and the debugging console will have "KeyPressed, code: ##"
     * printed for any keys you have pressed. 
     */
    console.log('KeyPressed, code: ' + keyCode);

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

/**
 * The draw() function draws one "frame" of the canvas. To animate the canvas
 * we simply change aspects of what we are drawing on each frame using
 * variables.
 */
function draw() {

    /**
     * This if-statement wraps all the logic in draw() and provides a condition
     * that allows us to optionally continue to draw or not.
     * 
     * The condition uses the negation operator '!' 
     * and the boolean OR operator '||'.
     * 
     * The way we can read this is:
     * IF the simulation is not paused (!simulationPaused)
     * OR,
     * the advanceFrame variable is set to true,
     * THEN continue to draw the frame, else do nothing. 
     */
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
         * These two local variables calculate the x and y position of the center
         * of the colored circle which we are about to draw.
         */
        var x = quarterCanvas * cos(omega3 * time);
        var y = quarterCanvas * sin(omega2 * time);
        
        var dia = (MAX_DIA - MIN_DIA) * ((sin(omega * time) + 1) / 2) + MIN_DIA;

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
        circle(x, y, dia);
        
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