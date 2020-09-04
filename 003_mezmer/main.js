
/**
 * Varables (these can change during runtime)
 */

var time;
var omega;

/**
 * Now let's make more variables to control the position of the circle on the
 * canvas. More details in reset().
 */
var omega2;
var omega3;
var quarterCanvas;
var canvasCenterX;
var canvasCenterY;

/**
 * A boolean variable like firstFrame allows us to write an if-statement to
 * draw something only once (in this case, clearing the canvas and drawing 
 * the background). More details in draw().
 */
var firstFrame = true;

/**
 * CONSTANTS (these cannot change during runtime)
 */

const MAX_DIA = 200;
const MIN_DIA = 20;

/**
 * Resets variables when the window resizes and sets them when called in setup(). 
 */
function reset() {
    firstFrame = true;
    time = 0;
    omega = 2 * PI / 4000;

    /**
     * We can have different "omega" variables. These variables are controlling
     * the frequency of the various "periodic" motions in the simulation.
     * 
     * Radians are nice for this, because the periodic frequency, omega (in Hz), 
     * of a periodic wave (sin or cos) is equal to 2 * PI / T, where T is the 
     * period of the motion (in milliseconds). 
     * We can't use 2 * PI / T with degrees, only radians.
     * 
     * omega = 2 * PI / T
     * 
     * This means we can choose how long (in milliseconds) we want it to take
     * for the wave to complete 1 oscillation easily.
     * 
     * Periodic waves are functions of the form:
     * a(t) = Amplitude * sin( omega * time ) + Offset
     * or
     * a(t) = Amplitude * cos( omega * time ) + Offset
     * 
     */

    // A wave with this periodic frequency takes 7 seconds to
    // complete 1 oscillation.
    omega2 = 2 * PI / 7000;

    // A wave with this periodic frequency takes 6.543 seconds to
    // complete 1 oscillation.
    omega3 = 2 * PI / 6543;
    
    /**
     * It would also be nice to be able to center our drawing on the screen.
     * We can easily do this by calculating the center of the window. In the
     * draw() function, we will shift the canvas so that we are drawing relative
     * to its center instead of the upper-left corner of the window.
     */
    canvasCenterX = windowWidth / 2;
    canvasCenterY = windowHeight / 2;

    /**
     * This value is used to bound the oscillations of the position of the 
     * circle, it is arbitrary. Experiment with changing it and what effects
     * you can get!
     */
    quarterCanvas = min(windowWidth / 4, windowHeight / 4);

    /**
     * As explained above, it's more convenient to define frequency in terms of
     * radians, so set all our trigonometry to use radians instead of degrees.
     */
    angleMode(RADIANS);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    reset();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    reset();
}

/**
 * The draw() function draws one "frame" of the canvas. To animate the canvas
 * we simply change aspects of what we are drawing on each frame using
 * variables.
 */
function draw() {

    /**
     * Here we have our first conditional logic. This if-statement checks to see
     * if the "firstFrame" variable is set to true (it is initialized to true
     * on line 24). If firstFrame equals true, then all of the operations in the
     * curly braces {} are executed.
     * 
     * In this case, the background will be drawn (a very dark grey), and the
     * variable firstFrame will be set to false. The only time firstFrame will
     * be true is when the program has just started or reset() has been called.
     * 
     * The background() function does two things:
     *  1. It clears all of the pixels in the canvas back to a blank state, and
     *  2. It paints the entire canvas the color you specify.
     * 
     * This logic means that the canvas will only be cleared and the background
     * repainted when the program first executes or when reset(), and that
     * produces the awesome effect we see of the circle brushing color across
     * the canvas.
     */
    if (firstFrame == true) {
        background(20, 20, 20);
        firstFrame = false;
    }

    /**
     * Reference for translate:
     * https://p5js.org/reference/#/p5/translate
     * 
     * Translate is a built-in p5.js function (line sin(), cos(), lerp(),
     * colorMode(), background(), etc.) that gives us control over where we
     * consider the origin (0,0) of our drawing to be. By default, the origin
     * is considered to be the upper-left corner of the screen with the positive 
     * x-axis pointing to the right (along the top edge of the screen), 
     * and positive y-axis pointing down (along the left edge of the screen). 
     * This function cannot change the direction of the y-axis, we'll fix that
     * in a later example.
     *  
     * In order to draw relative to the center of the canvas, we call translate
     * here to move the "origin" of the drawing to the center of the canvas.
     * We recalculate these values every time reset() is called.
     * 
     * Experiment with hard-coding other values in to this function to see how
     * it affects the drawing.
     */
    translate(canvasCenterX, canvasCenterY);

    /**
     * These two local variables calculate the x and y position of the center
     * of the colored circle which we are about to draw. Notice that x is defined
     * as a result of a cos function and y is defined as a result of a sin
     * function. Additionally, these use two different periodic frequencies,
     * omega2 and omega3 (which means they oscillate at different speeds).
     * 
     * Experiment with changing the periodic frequencies of each expression
     * omega2 and omega3 (recall we set these values in reset() on lines 64 
     * and 68):
     *  * What happens when they are both the same 
     *    (omega2 = 2 * PI / 2000, omega3 = 2 * PI / 2000)?
     * 
     *  * What happens when one is a multiple of the other 
     *    (omega2 = 2 * PI / 2000, omega3 = 2 * PI / 4000)?
     * 
     *  * What happens when they are just slightly different 
     *    (omega2 = 2 * PI / 1900, omega3 = 2 * PI / 2000)?
     */
    var x = quarterCanvas * cos(omega3 * time);
    var y = quarterCanvas * sin(omega2 * time);

    var dia = (MAX_DIA - MIN_DIA) * ((sin(omega * time) + 1) / 2) + MIN_DIA;

    var hue = lerp(0, 255, (time % 10001) / 10000.0);
    colorMode(HSB);
    noStroke();
    fill(hue, 255, 255);
    circle(x, y, dia);
    
    /**
     * Reset the color mode state.
     */
    colorMode(RGB)

    /**
     * Simulate time passing...
     */
    time += deltaTime;
}