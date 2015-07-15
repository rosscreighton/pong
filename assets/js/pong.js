// setup game params
var gameDimensions = {
  windowHeight: window.innerHeight,
  gameContainerWidth: document.getElementById('game-col').clientWidth
};
var gameSetup = {
  height: gameDimensions.windowHeight * 0.8,
  width: gameDimensions.gameContainerWidth,
  scoreboard: document.getElementById('scoreboard'),
  scoreboardHeight: this.scoreboard.clientHeight,
  buttonHeight: gameDimensions.windowHeight - this.scoreboardHeight - this.height,
  leftButton: document.getElementById('left-button'),
  rightButton: document.getElementById('right-button'),
  paddleWidth: this.width / 8,
  paddleHeight: this.paddleWidth / 7,
  playerSpeed: 6,
  paddleCenter: this.width / 2 - this.paddleWidth / 2,
  computerStartPositionX: this.paddleCenter,
  computerStartPositionY: 0,
  playerStartPositionX: this.paddleCenter,
  playerStartPositionY: this.height - this.paddleHeight,
  ballRadius: this.paddleHeight / 1.5,
  ballStartPositionX: this.width / 2,
  ballStartPositionY: this.height / 2,
  ballStartSpeed: 0,
  dpi: window.devicePixelRatio,
  playerScoreField: document.getElementById('player-score'),
  computerScoreField: document.getElementById('computer-score'),
  winningScore: 7,
  computerMaxSpeed: 7,
  setGameSpeed: function(){
    if (this.dpi <= 1) {
      this.ballStartSpeed = 7;
    } else if (this.dpi > 1 && this.dpi < 2) {
      this.ballStartSpeed = 8;
      this.playerSpeed = 8;
    } else {
      this.ballStartSpeed = 9;
      this.playerSpeed = 9;
    };

    this.computerMaxSpeed = this.playerSpeed + 1;
  },
  setButtonHeight: function() {
    this.leftButton.setAttribute('style', 'height:' + this.buttonHeight + 'px');
    this.rightButton.setAttribute('style', 'height:' + this.buttonHeight + 'px');
  }
};

gameSetup.setGameSpeed();
gameSetup.setButtonHeight();

var keysDown = {};
var leftButtonPressed = false;
var rightButtonPressed = false;

// Creating the canvas

var canvas = document.createElement('canvas');

canvas.width = gameSetup.width;
canvas.height = gameSetup.height;
var context = canvas.getContext('2d');

// Add canvas to page

window.onload = function() {
  var gameCol = document.getElementById('game-col');
  gameCol.insertBefore(canvas, gameCol.firstChild);
  animate(step);
};

// Storing Key Presses

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

// Storing control button presses

var leftMouseDown = function() { //function to update leftButtonPressed
  leftButtonPressed = true;
};
var leftMouseUp = function() { //funciton to update leftButtonPressed
  leftButtonPressed = false;
};
var rightMouseDown = function() { //function to update righButtonPressed
  rightButtonPressed = true;
};
var rightMouseUp = function() { //funciton to update rightButtonPressed
  rightButtonPressed = false;
};

// Event listeners to see if left button is pressed
gameSetup.leftButton.addEventListener('mousedown', leftMouseDown, false);
gameSetup.leftButton.addEventListener('mouseup', leftMouseUp, false);
gameSetup.leftButton.addEventListener('touchstart', leftMouseDown, false);
gameSetup.leftButton.addEventListener('touchend', leftMouseUp, false);
gameSetup.rightButton.addEventListener('mousedown', rightMouseDown, false);
gameSetup.rightButton.addEventListener('mouseup', rightMouseUp, false);
gameSetup.rightButton.addEventListener('touchstart', rightMouseDown, false);
gameSetup.rightButton.addEventListener('touchend', rightMouseUp, false);

// Keeping Score

var resetScores = function() {
  computer.score = 0;
  player.score = 0;
  gameSetup.computerScoreField.innerHTML = '0';
  gameSetup.playerScoreField.innerHTML = '0';
};

var score = function() {
  if (computer.score >= gameSetup.winningScore || player.score >= gameSetup.winningScore) {
    if (computer.score >= gameSetup.winningScore) {
      alert("Computer Won!");
    } else if (player.score >= gameSetup.winningScore) {
      alert("You Won!");
    };
    resetScores();
  };
};

// Reset position after someone scores

var resetPosition = function() {
  ball.x = gameSetup.ballStartPositionX;
  ball.y = gameSetup.ballStartPositionY;
  ball.x_speed = 0;
  ball.y_speed = gameSetup.ballStartSpeed;
  computer.paddle.x = gameSetup.computerStartPositionX;
  player.paddle.x = gameSetup.playerStartPositionX;
  leftButtonPressed = false;
  rightButtonPressed = false;
};

// Paddle Constructor

function Paddle(x, y) {
  this.x = x;
  this.y = y;
  this.width = gameSetup.paddleWidth;
  this.height = gameSetup.paddleHeight;
  this.x_speed = 0;
  this.y_speed = 0;
};

// Render Method for paddles

Paddle.prototype.render = function() {
  context.fillStyle = "#000";
  context.fillRect(this.x, this.y, this.width, this.height);
};

// Move method for paddles

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if (this.x < 0) { // paddle hitting left wall
    this.x = 0;
    this.x_speed = 0;
  } else if (this.x + this.width > width) { // paddle hitting right wall
    this.x = width - this.width;
    this.x_speed = 0;
  };
};

// Player constructor

function Player() {

  this.paddle = new Paddle(gameSetup.playerStartPositionX, gameSetup.playerStartPositionY);
  this.score = 0;
};

// update score for player

Player.prototype.iScored = function() {
  this.score++;
  var playerScoreText = document.createTextNode(this.score);

  gameSetup.playerScoreField.innerHTML = '';
  gameSetup.playerScoreField.appendChild(playerScoreText);
};

// Update method for players

Player.prototype.update = function() {
  for (var key in keysDown) {
    var value = Number(key);
    if (value == 37) { // left arrow pressed
      this.paddle.move(-gameSetup.playerSpeed, 0);
    } else if (value == 39) { // right arrow pressed
      this.paddle.move(gameSetup.playerSpeed, 0);
    } else {
      this.paddle.move(0, 0);
    };
  };

  if (leftButtonPressed) {
    this.paddle.move(-gameSetup.playerSpeed, 0);
  } else if (rightButtonPressed) {
    this.paddle.move(gameSetup.playerSpeed, 0);
  } else {

  };
};

// Render method for players

Player.prototype.render = function() {
  this.paddle.render();
};

// computer constructor

function Computer() {
  this.paddle = new Paddle(gameSetup.computerStartPositionX, gameSetup.computerStartPositionY);
  this.score = 0;
};

// update score for computer

Computer.prototype.iScored = function() {
  this.score++;
  var computerScoreText = document.createTextNode(this.score);

  gameSetup.computerScoreField.innerHTML = '';
  gameSetup.computerScoreField.appendChild(computerScoreText);
};

// update method for computers

Computer.prototype.update = function(ball) {
  var x_pos = ball.x;
  var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);

  if (diff < 0 && diff < -(gameSetup.computerMaxSpeed - 1)) { // max speed left
    diff = -gameSetup.computerMaxSpeed;
  } else if (diff > 0 && diff > gameSetup.computerMaxSpeed - 1) { // max speed right
    diff = gameSetup.computerMaxSpeed;
  }

  if (ball.y < gameSetup.height / 3 || ball.y_speed <= 0) {
    this.paddle.move(diff, 0);
  };

  if (this.paddle.x < 0) {
    this.paddle.x = 0;
  } else if (this.paddle.x + this.paddle.width > gameSetup.width) {
    this.paddle.x = gameSetup.width - this.paddle.width;
  }
};

// Render method for computers

Computer.prototype.render = function() {
  this.paddle.render();
};

// Ball constructor

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 0;
  this.y_speed = gameSetup.ballStartSpeed;
  this.radius = gameSetup.ballRadius;
};

// Update method for balls

Ball.prototype.update = function(paddle1, paddle2) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var top_x = this.x - this.radius;
  var top_y = this.y - this.radius;
  var bottom_x = this.x + this.radius;
  var bottom_y = this.y + this.radius;

  if (this.x - this.radius < 0) { // hitting the left wall
    this.x = this.radius;
    this.x_speed = -this.x_speed;
  } else if (this.x + this.radius > gameSetup.width) { // hitting the right wall
    this.x = gameSetup.width - this.radius;
    this.x_speed = -this.x_speed;
  };

  if (this.y < 0 || this.y > gameSetup.height) { // a point was scored
    if (this.y < 0) { // player scored
      player.iScored();
    };

    if (this.y > gameSetup.height) { // computer scored
      computer.iScored();
    };

    resetPosition();
  };

  if (top_y > gameSetup.height / 2) {
    if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
      // hit the player's paddle
      this.y_speed = -this.y_speed;
      this.x_speed += (paddle1.x_speed / 2);
      this.y += this.y_speed;
    }
  } else {
    if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
      // hit the computer's paddle
      this.y_speed = -this.y_speed;
      this.x_speed += (paddle2.x_speed / 2);
      this.y += this.y_speed;
    };
  };
};

// Render method for balls

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#000000";
  context.fill();
};

// Update all objects for render

var update = function() {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
};

// Render objects to canvas

var render = function() {
  context.fillStyle = "#fff";
  context.fillRect(0, 0, gameSetup.width, gameSetup.height);
  player.render();
  computer.render();
  ball.render();
};

// Call step 60 times per second

var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };;

// Loop through update, render, animate

var step = function() {
  score();
  update();
  render();
  animate(step);
};

// Create the instances of each object and play the game

var player = new Player();
var computer = new Computer();
var ball = new Ball(gameSetup.ballStartPositionX, gameSetup.ballStartPositionY);