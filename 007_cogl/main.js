var gfx;
var cogl;
var mdata;
var time;

function toggleSimulationPaused() {
    gfx.simulationPaused = !gfx.simulationPaused;
}

function bijectIntToNat(i) {
    if (i >= 0) {
        return i * 2;
    } else {
        return (-i * 2) - 1;
    }
}

function iBijectIntToNat(n) {
    if (n % 2 == 0) { //even (positive)
        return n / 2;
    } else { //odd (negative)
        return -(n + 1) / 2;
    }
}

function cantor(x, y) {
    x = bijectIntToNat(x);
    y = bijectIntToNat(y);

    return ((x + y) * (x + y + 1)) / 2 + y;
}

function icantor(p) {
    var w = Math.floor((Math.sqrt(8 * p + 1) - 1) / 2);
    var t = (w * w + w) / 2;
    var u = p - t;
    var y = iBijectIntToNat(u);
    var x = iBijectIntToNat(w - u);
    return { x: x, y: y };
}

function resetSimulation() {
    gfx.simulationPaused = false;
    gfx.simulationFrames = 0;
    gfx.firstFrame = true;
    gfx.advanceFrame = false;
    gfx.drawDebug = false;
    gfx.transX = 0;
    gfx.transY = 0;
    // gfx.centerX = windowWidth / 2;
    // gfx.centerY = windowHeight / 2;
    time = 0;

    var aspectRatio = (windowWidth + 0.0) / windowHeight;
    var fxCellCount = windowWidth / 16; 
    var xCellCount = Math.floor(fxCellCount);
    var yCellCount = Math.floor(fxCellCount / aspectRatio);
    console.log(xCellCount);
    console.log(yCellCount);

    rPentamino = [
        cantor(80, 31),
        cantor(80, 32),
        cantor(80, 30),
        cantor(79, 31),
        cantor(81, 32)
    ];

    cogl = {
        xCellCount: xCellCount,
        yCellCount: yCellCount,
        current: new Set(rPentamino),
        next: new Set()
    };

    mdata = {};
}

function mouseDragged() {
    // if (mdata.lastX != null && mdata.lastY != null && mdata.lastT != null) {
    //     if (time - mdata.lastT !== 0) {
    //         mdata.velX = (mouseX - mdata.lastX) / (time - mdata.lastT);
    //         mdata.velY = -(mouseY - mdata.lastY) / (time - mdata.lastT);
    //         console.log("mData, velX: " + mdata.velX + " velY: " + mdata.velY);    
    //     }
    // }

    if (mdata.lastX) {
        gfx.transX += (mouseX - mdata.lastX);
    }
    
    if (mdata.lastY) {
        gfx.transY -= (mouseY - mdata.lastY);
    }
    

    mdata.lastX = mouseX;
    mdata.lastY = mouseY;
    mdata.lastT = time;
    return false;
}

function mouseReleased() {
    mdata.lastX = null;
    mdata.lastY = null;
    mdata.lastT = null;
    mdata.velX = 0;
    mdata.velY = 0;
    return false;
}

function keyPressed() {
    var preventDefault = false;

    // console.log('KeyPressed, code: ' + keyCode);

    switch (keyCode) {
        case 32: { // key 'space'
            toggleSimulationPaused();
            preventDefault = true;
            break;
        }
        case 190: { // key '.'
            if (gfx.simulationPaused) {
                gfx.advanceFrame = true;
                preventDefault = true;
            }
            break;
        }
        case 82: { // key 'r'
            resetSimulation();
            preventDefault = true;
        }
        default: {
            break;
        }
            
    }

    return !preventDefault;
}

function setup() {
    angleMode(RADIANS);
    gfx = {
        canvas: createCanvas(windowWidth, windowHeight)
    };
    resetSimulation();
}

function windowResized() {
    gfx.canvas = resizeCanvas(windowWidth, windowHeight);
    resetSimulation();
}

function draw() {
    
    if (!gfx.simulationPaused || gfx.advanceFrame) {
        gfx.advanceFrame = false;

        background(0, 0, 0, 100);
        if (gfx.firstFrame == true) {
            background(0, 0, 0);
            gfx.firstFrame = false;
        }

        // rotate(TWO_PI / 30000 * deltaTime);
        translate(gfx.transX, windowHeight - gfx.transY);
        scale(1.0, -1.0);
        push();
        colorMode(HSB);

        var hue = lerp(0, 360, (time % 10001) / 10000.0);

        // Live phase
        var deadTestCells = new Set();
        for (let hash of cogl.current)
        {
            let cell = icantor(hash);
            noStroke();
            fill(hue, 100, 100);
            rect(cell.x * 16, cell.y * 16, 16, 16);

            var neighbors = 0;
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    if (i == 0 && j == 0) {
                        continue;
                    }

                    let test = cantor(cell.x + i, cell.y + j);
                    if (cogl.current.has(test)) {
                        neighbors++;
                    } else {
                        deadTestCells.add(test);
                    }
                }
            }
            
            // If neighbors is 2 or 3, this cell continues to the next generation
            if (neighbors > 1 && neighbors < 4) {
                cogl.next.add(hash);
            }
        }

        // Dead phase
        for (let hash of deadTestCells) {
            
            let cell = icantor(hash);

            neighbors = 0;
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    if (i == 0 && j == 0) {
                        continue;
                    }

                    let test = cantor(cell.x + i, cell.y + j);
                    if (cogl.current.has(test)) {
                        neighbors++
                    }
                }
            }
            
            // If neighbors is 3, this cell comes to live in the next generation
            if (neighbors == 3) {
                cogl.next.add(hash);
            }
        }
        cogl.current = new Set([...cogl.next]);
        cogl.next = new Set();

        colorMode(RGB);
        pop();

        // if (mdata.velX) {
        //     gfx.transX = gfx.transX + (mdata.velX * deltaTime);
        // }
        
        // if (mdata.velY) {
        //     gfx.transY = gfx.transY + (mdata.velY * deltaTime);
        // }
        console.log(gfx.transX);

        time += deltaTime;
        gfx.simulationFrames++;
    }
}