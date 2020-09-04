
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
 * Controls drawing the background on the first frame or on reset() only.
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

    // Only draw the background when the program starts or reset() is called.
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
     * We recalculate these values every time reset() is called.
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
     * Originally (see the previous file in "003_mezmer/main.js"), we used
     * lerp to interpolate between 0 and 255 to control the hue value and the
     * brightness and saturation were both set to 255.
     * 
     * <code>
     *      var hue = lerp(0, 255, (time % 10001) / 10000.0);
     *      colorMode(HSB);
     *      ...
     *      //   H    S    B
     *      fill(hue, 255, 255);
     * </code>
     * 
     * Checking the reference for colorMode() at: 
     * https://p5js.org/reference/#/p5/colorMode
     * reveals that the default ranges for HSB are,
     * H: [0, 360]
     * S: [0, 100]
     * B: [0, 100]
     * 
     * So, in order to correctly display the colors in our simulation, we update
     * our lerp() and fill() function calls to use the correct values for hue,
     * saturation, and brightness.
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
}