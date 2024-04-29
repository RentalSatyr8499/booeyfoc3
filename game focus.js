/* constants :) */
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var dx = 0; // ghost initial velocity
var dy = 0;
var ghostSpeed = 2;

var ghostSize = .6; 
var bgSize = .5;

var level = 0;
var levelChangeInterval = 300; // The time interval at which opacity changes (in milliseconds)
var levelMax = 3;
var levelMin = 0;   

/* load images!*/
// GHOST
var ghostImage = createImage('./art/ghost1.png');
var ghostX, ghostY;
// Set the initial x and y coordinates inside the onload event
ghostImage.onload = function() {
    ghostX = (canvas.width / 2) - ghostSize*(ghostImage.width / 2);
    ghostY = (canvas.height*.66) - ghostSize*(ghostImage.height / 2);
};

// BG
var bg = [[], [], [], []]; // Initialize the bg array
for (var i = 0; i < 4; i++) { // Load in bg images! 
    for (var j = 0; j < 4; j++) { // begin by looping through each element in the bg array
        var img = new Image(); // Create a new image object
        var filename = `./art/foc1-bg ${String.fromCharCode(65 + i)}${j}.png`; // Construct the filename based on the current indices
        img.src = filename; // Set the source of the image object
        bg[i][j] = img; // Load the image object into the bg array
    }
}




/* draw images!*/
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // canvas
    
    /* BG BEFORE GHOST */
    for (var i = bg.length - 1; i >= level; i--) { // Loop through each element in the bg array in reverse order    
        var imgIndex = i - level; // Calculate the image index
        ctx.drawImage(bg[i][imgIndex], 0, 0, bgSize*bg[i][imgIndex].width, bgSize*bg[i][imgIndex].height);
    }

    /* GHOST */     
    ctx.drawImage(ghostImage, ghostX, ghostY, ghostSize*ghostImage.width, ghostSize*ghostImage.height); // Draw the ghost
    ghostX += dx; // move ghost if needed
    ghostY += dy;


    /* BG AFTER GHOST */
    for (var i = level; i >= 0; i--) { // Loop through each element in the bg array in reverse order    
        var imgIndex = level - i;// Calculate the image index
        ctx.drawImage(bg[i][imgIndex], 0, 0, bgSize*bg[i][imgIndex].width, bgSize*bg[i][imgIndex].height); // draw image
    }
    
    // Inside your draw function:
    ctx.font = '20px Arial'; // Set the font size and family
    ctx.fillStyle = 'black'; // Set the text color
    ctx.fillText('level: ' + level, 10, 50); // Draw the text on the canvas 

}
setInterval(draw, 10);

/* listen for user input!*/
var keyDownTime = null;
document.onkeydown = function(e) {
    var shiftPressed = e.shiftKey; // Check if the shift key is pressed
    switch (e.keyCode) {
        case 37:
            dx = -ghostSpeed;
            dy = 0;
            break;
        case 38:
            if (shiftPressed) {
                dy = -ghostSpeed;
            
            } else {
                dx = 0;
                dy = 0;
                if (keyDownTime === null && level <= levelMax) {
                    keyDownTime = Date.now();
                    increaseLevel(); // Call increaseLevel when the up key is pressed
            }
        }
            break;
        case 39:
            dx = ghostSpeed;
            dy = 0;
            break;
        case 40:
            if (shiftPressed) {
                dy = ghostSpeed;
            } else {
                dx = 0;
                dy = 0;
                if (keyDownTime === null && level >= levelMin) {
                    keyDownTime = Date.now();
                    decreaseLevel(); // Call decreaseLevel when the down key is pressed
                }
        }
            break;
    }
};

document.onkeyup = function(e) {
    dx = 0;
    dy = 0;
    keyDownTime = null;
};

function decreaseLevel() {
    if (level <= levelMin) { // If level is already at the minimum, return without changing level
        return;
    }
    if (keyDownTime !== null && level <= levelMax) {
        level -= 1;
        setTimeout(decreaseLevel, levelChangeInterval);
    }
}

function increaseLevel() {
    if (level >= levelMax) { // If level is already at the maximum, return without changing level
        return;
    }
    if (keyDownTime !== null && level >= levelMin) {
        level += 1;
        setTimeout(increaseLevel, levelChangeInterval);
    }
}

function createImage(src) {
    var img = new Image();
    img.src = src;
    return img;
}