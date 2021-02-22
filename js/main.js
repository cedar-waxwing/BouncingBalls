// SET UP CANVAS

const canvas = document.querySelector('canvas');

//represents drawing area of canvas

const ctx = canvas.getContext('2d');

//chaining multiple assignemnts to get varables listed more quickly/easily
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;


// GENERATE RANDOM NUMBER

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

//DEFINE BALL CONSTRUCTOR. Balls will all be the same. Represent them as an object. 


function Ball(x, y, velX, velY, color, size) {
/* x & y coordinates for where ball starts on screen. 0 is top left hand corner. 
Full width & height of browser viewer is bottom righthand corner. */
    this.x = x;
    this.y = y;
/*Horizonal & vertical velocity. These vals are added to the x & y coordiantes when animate the balls. 
e.g. 'Move them by this much each frame'*/
    this.velX = velX;
    this.velY = velY;
    this.color = color;
/* radius in pixels */
    this.size = size;
}

/* DEFINE BALL DRAW METHOD. Adding draw() method to ball's prototyp. We're telling ball to draw itself onto the screen. 
Do this by calling members of the 2D canvas we defined previously in (ctx). */

Ball.prototype.draw = function() {
    /* states that we want to draw a shape on the paper. */
    ctx.beginPath();
    /* Defines shape's color. Set it to the ball's color property. */
    ctx.fillStyle = this.color;
    /* Traces an arc shape on the paper. Parameters: (x position, y position, arc radius aka size property, 
    start and end # of degrees around circle that arc is drawn between -- here, 0 and 2*PI which = 360* in radiens) */
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    /* finish drawing path we started with beginPath(), & fill area it takes up with the color specified in fillStyle*/

    ctx.fill();
};

/* DEFINE BALL UPDATE METHOD. This will add an update method to the ball's prototype*/

Ball.prototype.update = function() {
    /* First four parts determine if ball has reached edge of canvas. 
    If so, reverse polarity of recent velocity to change ball's direction. 
    Positive to negative velocity and vice versa.*/

    /* Example here: if x coordinate is greater than the width of the canvas 
    (e.g. the ball is going off the ******right side of the canvas*****) */
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }
/* going off left edge of canvas*/
    if ((this.x + this.size) <= 0) {
        this.velX = -(this.velX);
    }
/*going off bottom edge*/
    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }
/*going off top edge*/
    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }
/*We have to include the size of the ball in each calculation above, bc the coordinates are the 
middle of the ball and we want to consider that*/

/*These last two lines add velX value to the x coordinate, and velY value to Y coordinate. 
Ball is moved each time this method is called. */
 
    this.x += this.velX;
    this.y += this.velY;
};

/* DEFINE BALL COLLISION DETECTION. According to notes -- this is somewhat complex. Don't worry if don't fully understand for now.
Here, we need to check every other ball to see if it has collided with the current ball. To do this, 
use a for loop to loop through all balls in the balls[] array. */

Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        /* Here, we use an if statement to check whether the current ball being looped through is the
        same ball as the one we are currently checking. No need to check whether the ball as collided with itself. 
        So, check whether current ball -- aka ball whose collisionDetect method is being invoked -- is the same as 
        the loop ball aka the ball that is being referred to by the current iterationof the for loopin the 
        collisionDetect method. Then use ! to negate the check so that the code inside the if statement runs only
        if they are *NOT* the same. */
        if (!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls [j].y;
            /* Then check the collision of two circles -- check whether the circles' areas overlap */
            const distance = Math.sqrt(dx * dx + dy * dy);
            /* If collision is detected, code inside this inner if statement is run. */
            if(distance < this.size + balls[j].size) {
            /* If run, set the color property of both circles to a random new color. Easier to implement than 
            getting the balls to bounce off each other or something like that.*/
                balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) + ')';
            }
        }
    }
}


/* Store all balls and then populate: */

let balls = [];

while (balls.length < 25) {
    let size = random(10,20);
    let ball = new Ball(
        /* ball position always drawn to at least one ball width away from edge of canvas to avoid spillage*/
    random(0 + size,width - size), 
    random(0 + size,height - size), 
    random(-7,7), 
    random(-7,7), 
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) + ')',
    size
    );

    balls.push(ball);
}

/* Above, the while loop is creating a new instance of 'Ball()' using random values generates with our random() 
function, then push()ing it onto the end of our balls array -- but only while # of balls in the array is <25.*/

/* Animation loop serves to update the info in the program & then render resulting view 
on each frame of the animation. This loop function does the following: */

function loop() {
    /*Sets canvas fill color to be semi-transparent*/
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    /*Draws rectangle of color across the whole width & height of canvas, using fillRect. Four paramenters are
    a start coordinate and a width and height for rectangle drawn. This covers up the previous frame's drawing 
    before the next one is drawn. If this was not here there would be long snakes all over the screen. */
    ctx.fillRect(0,0,width,height);

    for (let i = 0; i < balls.length; i++) {
        /* This loops through all the balls in the balls array and runs each ball's draw() and update() function
        to draw each one on the screen, and do the necessary updates to position and velocity in time for the 
        next frame. */
        balls[i].draw();
        balls[i].update();
        /* Call color change on collision in each frame of the animation*/
        balls[i].collisionDetect();
    }
/* This runs the function again using the requestAnimationFrame() methos. When this method is run repeatedly 
and is passed the same function name, it runs the function a set number of times per second to create a smooth 
animation. This is done recursively aka it calls itself every time it runs, so it runs over and over again.*/
    requestAnimationFrame(loop);
    }

/*Call the function once to get the animation started*/
loop();

/* ADDING COLLISION DETECTION*/

