
/**
 *  1. Variables have "scope", generally speaking if a variable is declared in 
 * curly braces, "{}" then the variable is not accessible outside of them. 
 * 
 * Starting out, we can define our variables with "global" scope. Later on,
 * we can learn to manage them differently. 
 * 
 * We can use the keyword "var" to declare variables. Variables can be named
 * anything we like, so long as the name isn't already taken.
 */

var time;
var omega;

/**
 * We can also declare constants. Constants can also be named anything we like,
 * but it's a good idea to use a different "case" style differentiate them from
 * variables.
 */

const MAX_DIA = 200;
const MIN_DIA = 20;

/**
 * Let's create a function that resets any variables that need to reset when the
 * window resizes and be set in setup(). 
 */
function reset() {
    time = 0;
    omega = 2 * PI / 2000;
    /**
     * Reference for angle mode:
     * https://p5js.org/reference/#/p5/angleMode
     * 
     * Just like on our calculator, we have to choose whether or not to use
     * degrees or radians for angle measurements. We can change this in other
     * places in our code if we want to swap between the two types of angles.
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
    background(220, 220, 220);

    /**
     * Reference for the sin() function.
     * https://p5js.org/reference/#/p5/sin
     * 
     * We are going to use a local variable to control the diameter of the
     * circle. Each time the window is drawn (many times per second), the
     * diameter of the circle will be calculated.
     * 
     * diameter(t) = (A_max - A_min) * ((sin(omega*t) + 1) / 2) + A_min
     */
    var dia = (MAX_DIA - MIN_DIA) * ((sin(omega * time) + 1) / 2) + MIN_DIA;

    var hue = lerp(0, 255, (time % 10001) / 10000.0);
    colorMode(HSB);
    fill(hue, 255, 255);
    circle(200, 200, dia);
    colorMode(RGB)
    /**
     * In order for drawings to animate, we must keep track of how much time
     * is passing. p5.js has a variable that measures the time (in milliseconds)
     * between frames 
     */
    time += deltaTime;
}