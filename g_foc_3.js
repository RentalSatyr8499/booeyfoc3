/* constants :) */
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var totBugs = 0;
var caughtBugs = 0;

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
var booeyX, booeyY;
// Set the initial x and y coordinates inside the onload event
ghostImage.onload = function() {
    booeyX = (canvas.width / 2) - ghostSize*(ghostImage.width / 2);
    booeyY = (canvas.height*.66) - ghostSize*(ghostImage.height / 2);
};

// BG
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

// bugs :o
var bugimg = createImage('./art/bug.png');
var bugHL = createImage('./art/bug-HL.png');
var bugY = createImage('./art/bug-Y.png');
var bugImg = {
    "default": bugimg, 
    "highlighted": bugHL,
    "yellow": bugY
};
bugSize = 20;

// alpha images
var bgAlpha = [0, new Image(), new Image(), new Image(), new Image()]; // bg
for (var i = 0; i < bgAlpha.length - 1; i++) {
    var letter = String.fromCharCode(65 + i); // 65 is the ASCII value for 'A'
    bgAlpha[i].src = './art/atmo1-bgAlpha ' + letter + '.png';
}

var textElement, bugCounter;
function instruction() {
    instructionContainer = document.createElement("div");
    instructionContainer.id = "instruction-Container";

    textElement = document.createElement("p");
    textElement.innerHTML = "Dang, that's a lot of cockroaches. Help Booey get rid of them all by clicking on it. Make sure to check behind the furniture (press the up arrow). You can move up and down by pressing shift + up arrow or shift + down arrow. Press the space bar to collect bugs as you move over them.";
    textElement.style.margin = "10px";  // Add margin to the text
    instructionContainer.appendChild(textElement);
    document.body.appendChild(instructionContainer);

    bugCounter = document.createElement("p");
    bugCounter.innerHTML = caughtBugs + "/" + totBugs + " bugs caught.";
    bugCounter.style.margin = "10px";  // Add margin to the text
    instructionContainer.appendChild(bugCounter);
    document.body.appendChild(instructionContainer);
}

var numBugs;
function initializeBugs(maxBugs, bugCoords, xmin, xmax, ymin, ymax) {
    numBugs = Math.floor(Math.random() * (maxBugs) + 1);
    let x, y, rotation;
    for (let i = 0; i < numBugs; i++) {
        x = Math.random() * (xmax - xmin) + xmin; // Random x between xmin and xmax
        y = Math.random() * (ymax - ymin) + ymin; // Random y between ymin and ymax
        rotation = Math.random() * 2 * Math.PI; // Random rotation between 0 and 2π
        bugCoords.push({"x": x, "y": y, "rotation": rotation, "on": true, "HL": false});
        
    }
    totBugs += numBugs;
}

var bugHL = createImage('./art/bug-HL.png');
var bug = createImage('./art/bug.png');

function drawBugs(img, coordsArray, booeyX, booeyY) {
    let x, y, rotation;
    for (let i = 0; i <coordsArray.length; i++) {
        x = coordsArray[i]["x"];
        y = coordsArray[i]["y"];
        rotation = coordsArray[i]["rotation"];

        ctx.save(); // Save the current state of the context
        ctx.translate(x + 5, y + 5); // Move the origin of the context to the center of the image
        ctx.rotate(rotation); // Rotate the context

        // Check if booeyX and booeyY are within fifty pixels of the bug
        if (coordsArray[i]["on"]){
            if (Math.abs(booeyX - x + 100) < 100 && Math.abs(booeyY - y + 100) < 100) {
                ctx.drawImage(bugHL, -5, -5, bugSize, bugSize); // Draw the image at the new origin
                coordsArray[i]["HL"] = true;
            } else {
                ctx.drawImage(img, -5, -5, bugSize, bugSize); // Draw the image at the new origin
            }
        }

        ctx.restore(); // Restore the context to its previous state
    }
}


generalBugCoords = [];
levelBugCoordConstraints = [
    0,
    {"x": [370, 500], "y": [280, 300]}, 
    {"x": [0, 25], "y": [80, 470]}, 
    {"x": [420, 500], "y": [50, 460]}, 
    {"x": [240, 390], "y": [335, 470]}
]
levelBugCoords = [
    0,
    [],
    [],
    [],
    []
]

initializeBugs(5, generalBugCoords, 0, 500, 0, 500);
for (var i = 1; i < levelBugCoords.length; i++){
    initializeBugs(10, levelBugCoords[i], levelBugCoordConstraints[i]["x"][0], levelBugCoordConstraints[i]["x"][1], levelBugCoordConstraints[i]["y"][0], levelBugCoordConstraints[i]["y"][1]);
};

function endGame(){
    for (var i = 0; i < partyGuests.length; i++) {
        partyGuestMovingStats[i]["dx"] = 0;
    } 
    var endGameContainer = document.createElement("div");
    endGameContainer.id = "endGame";

    var textElement = document.createElement("p");
    textElement.innerHTML = "Thanks for cleaning up the apartment! You caught " + totBugs + " bugs.";
    textElement.style.margin = "40px";  // Add margin to the text

    var button1 = document.createElement("button");
    button1.innerHTML = "Yuck, I'm never doing that again.";

    var button2 = document.createElement("button");
    button2.innerHTML = "You're welcome!";
    button1.style.margin, button2.style.margin = "10px";  // Add margin to the button2

    document.body.appendChild(endGameContainer);
    endGameContainer.appendChild(textElement);
    endGameContainer.appendChild(button1);
    endGameContainer.appendChild(button2);
    

}

instruction();
/* draw images!*/
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // canvas
     
    /* BG BEFORE GHOST */
    for (var i = bg.length - 1; i > level; i--) { // Loop through each element in the bg array in reverse order    
        var imgIndex = i - level; // Calculate the image index
        ctx.drawImage(bg[i][imgIndex], 0, 0, bgSize*bg[i][imgIndex].width, bgSize*bg[i][imgIndex].height);
    }

    /* GHOST */     
    ctx.drawImage(ghostImage, booeyX, booeyY, ghostSize*ghostImage.width, ghostSize*ghostImage.height); // Draw the ghost
    
    booeyX += dx; // move ghost if needed
    booeyY += dy;

    /* BG AFTER GHOST */
    for (var i = level; i >= 0; i--) { // Loop through each element in the bg array in reverse order    
        var imgIndex = level - i;// Calculate the image index
        ctx.drawImage(bg[i][imgIndex], 0, 0, bgSize*bg[i][imgIndex].width, bgSize*bg[i][imgIndex].height); // draw image
    }

    /* GENERAL BUGS */
    drawBugs( bugImg["default"], generalBugCoords, booeyX, booeyY);
    
    /* LEVEL BUGS */
    drawBugs(bugImg["yellow"], levelBugCoords[level], booeyX, booeyY);
    
    // Inside your draw function:
    ctx.font = '20px Arial'; // Set the font size and family
    ctx.fillStyle = 'black'; // Set the text color
    ctx.fillText('level: ' + level, 10, 50); // Draw the text on the canvas */

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
        case 32: 
            console.log("space detected!");
            for (var i = 0; i < levelBugCoords[level].length; i++){
                console.log("checking level " + [level] + " for highlighted bugs.");
                if (levelBugCoords[level][i]["HL"] && levelBugCoords[level][i]["on"]){
                    console.log("highlighted bug found!");
                    levelBugCoords[level][i]["on"] = false;
                    console.log(levelBugCoords[level]);

                    caughtBugs += 1;
                    bugCounter.innerHTML = caughtBugs + "/" + totBugs + " bugs caught.";
                }
            }
            if (level == 0) {
                console.log("checking for general highlighted bugs.")
                for (var i = 0; i < generalBugCoords.length; i++) {
                    if (generalBugCoords[i]["HL"]) {
                        console.log("highlighted bug found!");
                        generalBugCoords[i]["on"] = false;
                        console.log(generalBugCoords);

                        caughtBugs += 1;
                        bugCounter.innerHTML = caughtBugs + "/" + totBugs + " bugs caught.";
                }
            }
            if (caughtBugs >= totBugs) {
                endGame();
            }
        }
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