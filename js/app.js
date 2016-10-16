// Put all of the elements needed to be accessed in variables and declare any other variables that are needed.
var startMessage = document.querySelector('.start-message-container'),
    successMessage = document.querySelector('.success-container'),
    gameOverMessage = document.querySelector('.game-over-container'),
    closeButton = document.getElementById('close-btn'),
    gameResetCloseButton = document.getElementById('reset-close-btn'),
    gameResetButton = document.getElementById('game-reset-btn'),
    playButton = document.getElementById('play-btn'),
    startButton = document.getElementById('start-btn'),
    img = document.getElementsByTagName('img'),
    healthBox = document.createElement('div'),
    healthContainer = document.querySelector('.score-health-container'),
    heartImage,
    heartsRemaining = document.getElementsByClassName('heart'),
    carrotLocations = [1, 101, 201, 301, 401],
    carrotLocation = carrotLocations[Math.floor(Math.random() * carrotLocations.length)],
    scoreBox = document.querySelector('.score-box'),
    startMessageCSS = window.getComputedStyle(startMessage),
    successMessageCSS = window.getComputedStyle(successMessage),
    menu = document.getElementById('menu'),
    closeMenu = document.getElementById('close-menu'),
    instructions = document.querySelector('.instructions'),
    pointsPlaceholder = document.getElementsByClassName('points'),
    allEnemies = [],
    scoreCount = 0;
healthBox.classList.add('health-box');
healthContainer.insertBefore(healthBox, scoreBox);


// Game object to control the game's main functionality.
var Game = function() {
    this.paused = false;
    this.startGame = false;
};

// Game reset method
Game.prototype.gameReset = function(keycode) {
    // If R key is pressed then reset player, carrot, and car and bike enemies.
    if (keycode === 'reset') {
        reset();
    }
};

// Game pausing method
Game.prototype.startStop = function(keycode) {
    // If S key is pressed and all popup windows are closed then allow game to start
    if (keycode === 'startStop' && startMessageCSS.getPropertyValue('display') == 'none' && successMessageCSS.getPropertyValue('display') == 'none') {
        this.startGame = !this.startGame;
    }
};

// Game start method instantiates both car and bike enemy objects and pushes them to the empty allEnemies array that was declared.
Game.prototype.gameStart = function() {
    // Declare the number of enemy bikes
    var numberOfBikes = 4;
    // Push each enemy bike to the allEnemies array at random starting locations for x and same y location (on sidewalk)
    for (var i = 0; i < numberOfBikes; i++) {
        allEnemies.push(new Bike(Math.floor(Math.random() * 2) - 200, 235));
    }
    // Declare the number of enemy cars
    var numberOfCars = 3;
    // Create an array holding possible y locations for the cars so that remain on the road
    var yLocations = ['152', '69'];
    // Push each enemy car to the allEnemies array at random starting locations for x and  y
    for (var j = 0; j < numberOfCars; j++) {
        // CHoose at random a new starting y location from yLocations array
        var yLocation = yLocations[Math.floor(Math.random() * yLocations.length)];
        allEnemies.push(new Car(Math.floor(Math.random() * 2) - 200, yLocation));
    }
};

// Main Enemy object
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    this.x = x;
    this.y = y;
    this.speed = Math.floor(Math.random() * 55) + Math.floor(Math.random() * 200);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (game.startGame) {
        this.x = this.x + (this.speed * dt);
        if (this.x > 800) {
            this.x = -200;
        }
    }
};

// Car enemy object
var Car = function(x, y) {
    // Car enemy location
    Enemy.call(this, x, y);
    // Car enemy sprite
    this.sprite = 'images/car.png';
};

// Make Car inherint from Enemy object
Car.prototype = Object.create(Enemy.prototype);
Car.prototype.constructor = Car;

// Render car on screen
Car.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Bike enemy object
var Bike = function(x, y) {
    // Bike enemy location
    Enemy.call(this, x, y);
    // Bike enemy sprite
    this.sprite = 'images/bike.png';
};

// Make bike inherit from Enemy object
Bike.prototype = Object.create(Enemy.prototype);
Bike.prototype.constructor = Bike;

// Render bike on screen
Bike.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/bunny.png';
};

// Update the plauyer's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // Player update was not needed. Was able to achieve this without the update method.
};

// Player reset method
Player.prototype.reset = function() {
    this.x = 301;
    this.y = 401;
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player score counter method
Player.prototype.scoreCounter = function() {
    scoreCount = scoreCount + 20;
    // Updates score for all locations in which the score is visible on the front-end.
    for (i = 0; i < pointsPlaceholder.length; i++) {
        pointsPlaceholder[i].innerHTML = scoreCount;
    }
};

// Player score reset method
Player.prototype.scoreReset = function() {
    // Reset the score back to 0.
    scoreCount = 0;
    // Updates reset score for all locations in which the score is visible on the front-end.
    for (i = 0; i < pointsPlaceholder.length; i++) {
        pointsPlaceholder[i].innerHTML = scoreCount;
    }
};

// Collect player input on movements
Player.prototype.handleInput = function(keycode) {
    // Only allow movement when the game is running.
    if (game.startGame) {
        if (keycode === 'right' && this.x < 601) {
            this.x += 50;
        }
        if (keycode === 'left' && this.x > 1) {
            this.x -= 50;
        }
        if (keycode === 'up' && this.y > 0) {
            this.y -= 41.5;
        }
        if (keycode === 'down' && this.y < 401) {
            this.y += 41.5;
        }
    }
};

// Carrot object
var Carrot = function(x, y) {
    this.x = x;
    this.y = y;
    // Carrot sprite
    this.sprite = 'images/carrot.png';
};

// Carrot location reset method
Carrot.prototype.reset = function() {
    this.x = carrotLocations[Math.floor(Math.random() * carrotLocations.length)];
};

// Carrot render method
Carrot.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Game reset function
function reset() {
    // Sets allEnemy to a blank array
    allEnemies = [];
    // Sets game start to false
    game.startGame = false;
    // Resets player location
    player.reset();
    // Resets carrot location
    carrot.reset();
    // Runs gameStart method to populate enemy objects
    game.gameStart();

}

// Health(hearts) reset function
function healthReset() {
    for (i = 0; i < 4; i++) {
        heartImage = document.createElement('img');
        heartImage.classList.add('heart');
        heartImage.src = "images/heart.png";
        heartImage.alt = "Heart";
        healthBox.appendChild(heartImage);
    }
}

// Place the player object in a variable called player
var player = new Player(301, 401);

// Place the carrot object in a variable called carrot
var carrot = new Carrot(carrotLocation, -14);

// Place the game object in a variable called game
var game = new Game();

// Run gameStart method upon page load to populate enemy objects
game.gameStart();

// Run healthReset method upon page load
healthReset();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        82: 'reset',
        83: 'startStop'
    };
    player.handleInput(allowedKeys[e.keyCode]);
    game.gameReset(allowedKeys[e.keyCode]);
    game.startStop(allowedKeys[e.keyCode]);
});

// Front-end button click event listener functions
closeButton.addEventListener('click', function() {
    successMessage.style.display = 'none';
});

gameResetCloseButton.addEventListener('click', function() {
    gameOverMessage.style.display = 'none';
    player.scoreReset();
});

playButton.addEventListener('click', function() {
    successMessage.style.display = 'none';
    game.startGame = !game.startGame;

});

startButton.addEventListener('click', function() {
    startMessage.style.display = 'none';
    game.startGame = !game.startGame;
});

gameResetButton.addEventListener('click', function() {
    gameOverMessage.style.display = 'none';
    player.scoreReset();
    game.startGame = !game.startGame;
});

menu.addEventListener('click', function() {
    instructions.style.left = '0';
});

closeMenu.addEventListener('click', function() {
    instructions.style.left = '-400px';
});
