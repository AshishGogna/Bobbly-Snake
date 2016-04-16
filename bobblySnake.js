//Global variables

var maxWidth = 0;
var maxHeight = 0;

var score = 0;
var speed = 1;

var gameStarted = 0;

//The World
var world = {
    ctx:null,
    fps:20,
    themeColor: "#fe57a1"
}

world.init = function()
{
    $('#gameDiv').append('<canvas id="gameCanvas">');
    var $canvas = $('#gameCanvas');
    $canvas.attr('width', maxWidth);
    $canvas.attr('height', maxHeight);
    var canvas = $canvas[0];
    ctx = canvas.getContext('2d');
    
    world.ctx = ctx;

    snake.init();
}

//The Snake
var snake = {
    blockSize:20,
    direction:"right",
    blocks:[],
    headBang:0
}

snake.init = function()
{
    world.ctx.fillStyle = world.themeColor;

    snake.blocks.push([20,100]);
    snake.blocks.push([40,100]);

    for (var i=0; i<snake.blocks.length; i++)
    {
        var coordinates = snake.blocks[i];
        var x = coordinates[0];
        var y = coordinates[1];

        if (i == snake.blocks.length-1)
            world.ctx.fillStyle = '#000000';

        world.ctx.fillRect(x, y, snake.blockSize, snake.blockSize);
    }
}

snake.move = function()
{
    world.ctx.clearRect(0, 0, maxWidth, maxHeight);

    var firstBlock = snake.blocks.splice(0, 0);
    snake.blocks.shift();
    var lastBlock = snake.blocks[snake.blocks.length-1];


    if (snake.direction == "right")
        firstBlock = [lastBlock[0]+snake.blockSize, lastBlock[1]];
    if (snake.direction == "down")
        firstBlock = [lastBlock[0], lastBlock[1]+snake.blockSize];
    if (snake.direction == "left")
        firstBlock = [lastBlock[0]-snake.blockSize, lastBlock[1]];
    if (snake.direction == "up")
        firstBlock = [lastBlock[0], lastBlock[1]-snake.blockSize];
    
    snake.blocks.push(firstBlock);

    for (var i=0; i<snake.blocks.length; i++)
    {
        if (i == snake.blocks.length-1)
            world.ctx.fillStyle = '#000000';
        else
            world.ctx.fillStyle = world.themeColor;

        var coordinates = snake.blocks[i];
        var x = coordinates[0];
        var y = coordinates[1];

        world.ctx.fillRect(x, y, snake.blockSize, snake.blockSize);
    }

    //Place food at random coordinates
    if (food.x == 0 && food.y == 0)
        food.chooseRandomLocation();
    world.ctx.fillRect(food.x, food.y, food.blockSize, food.blockSize);

    //Detect collision
    snake.detectCollision();

    if (snake.headBang == 1)
    {
        snake.headBang = 0;

        var delay=1000;

        world.ctx.font="26px Sans-Serif";
        world.ctx.strokeText("Game Over", maxWidth/2-50, maxHeight/2, 100);

        setTimeout(function() {

            $("#gameDiv").empty();
            restartGame();
        }, delay);
    }
    else
    {
        setTimeout(function() {

            requestAnimationFrame(snake.move);
        }, 1000 / world.fps);
    }
}

snake.detectCollision = function()
{
    var lastBlock = snake.blocks[snake.blocks.length-1];

    //Body collision
    for (var i=0; i<snake.blocks.length; i++)
    {
        var coordinates = snake.blocks[i];
        var x = coordinates[0];
        var y = coordinates[1];

        var lastBlockX = lastBlock[0];
        var lastBlockY = lastBlock[1];

        if (i < snake.blocks.length-1 && i > 0)
            if (lastBlockX == x && lastBlockY == y)
                snake.headBang = 1;
    }

    //Food collision
    if (lastBlock[0] == food.x && lastBlock[1] == food.y)
    {
        snake.blocks.push([food.x, food.y]);

        food.x = 0;
        food.y = 0;   

        score++;
        speed+=0.1;
        updateScore();

        if (world.fps < 70)
            world.fps ++;
    }

    //Boundry Collision detection
    if (lastBlock[0] >= maxWidth || lastBlock[0] < 0)
        snake.headBang = 1;
    if (lastBlock[1] >= maxHeight || lastBlock[1] < 0)
        snake.headBang = 1;
}

//The Food
food = {
    x:0,
    y:0,
    blockSize:20
}

food.chooseRandomLocation = function()
{
    var randomX = Math.floor((Math.random() * maxWidth) + 0);
    var randomY = Math.floor((Math.random() * maxHeight) + 0);

    //X
    //n-(n%10)
    var modX = randomX % 20;
    var x = randomX-modX;

    //Y
    //n-(n%10)
    var modY = randomY % 20;
    var y = randomY-modY;

    food.x = x;
    food.y = y;

    for (var i=0; i<snake.blocks.length; i++)
    {
        var block = snake.blocks[i];
        if (x == block[0] && y == block[1])
            console.log("On the snake");
    }
}

//The Inputs
$( document ).keypress(function(e) {
    var ch = String.fromCharCode(e.charCode);
    if(e.ctrlKey){
    }else{

        if (gameStarted == 0)
        {
            gameStarted = 1;
            snake.move();
        }
    
        if (ch == "w")
        {
            if (snake.direction != "down")
                snake.direction = "up";
        }
        if (ch == "a")
        {
            if (snake.direction != "right")
                snake.direction = "left";
        }
        if (ch == "s")
        {
            if (snake.direction != "up")
                snake.direction = "down";
        }
        if (ch == "d")
        {
            if (snake.direction != "left")
                snake.direction = "right";
        }
    }
});

//Animation function
window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
    window.setTimeout(callback, 100 / 60);
};
})();

//Score update function
function updateScore()
{
    $('#scoreNum').html(score);
    $('#speedNum').html(Math.round(speed * 100) / 100 + "x");
}

//Game restart function, jest reloads the page
function restartGame()
{
    location.reload();
}

//Game initialization function
function initGame()
{
    console.log("BBB");
    maxWidth = $('#gameDiv').width();
    maxHeight = $('#gameDiv').height();
    world.init();
}

//Game menu initialization function
function initUI()
{
    $('#gameDiv').append('<div id="menu"><div id="buttons"><button onclick="startGame()">Start Game</button><button onclick="instructions()">Instructions</button></div></div>');
}

//Start game button onclick function
function startGame()
{
    $( "#menu" ).remove();
    gameStarted = 0;
    initGame();
}

//Instructions button onclick function
function instructions()
{
    $( "#menu" ).remove();
    $('#gameDiv').append('<div id="instructions"><div id="instructionsContent"><h3>How to play ?</h3><h4>Movement controls</h4>W = Up<br>D = Right<br>S = Down<br>A = Left<br><h4>Rules</h4>You just have to eat the food as many times as you can.<br>If you hit the boundry walls, you die.<h4>Difficulty</h4>The speed of snake increases 0.1x when snake eats the food. At the same time,<br>the score gets incremented too.</div></div>');
}

function changeThemeColor(color)
{
    //pink = 
    //orange = #F2A12C
    //lemon = #E4EC7D
    //sky = #29E5D7
    //yellow = #CCC902

    switch(color) {
        case "pink":
            world.themeColor = "#fe57a1";
            break;
        case "orange":
            world.themeColor = "#F2A12C";
            break;
        case "lemon":
            world.themeColor = "#E4EC7D";
            break;
        case "sky":
            world.themeColor = "#29E5D7";
            break;
        case "yellow":
            world.themeColor = "#CCC902";
            break;
        case "black":
            world.themeColor = "#000000";
            break;
        default:
            world.themeColor = "#fe57a1";
     }

    $("body").css("background", "url(images/background_" + color + ".jpg)");
    $("button").css("border", "1px solid " + world.themeColor);
    $("button").css("color", world.themeColor);

    $("button").mouseenter(function() {
        $(this).css("background-color", world.themeColor).css("color", "#ffffff");
    }).mouseleave(function() {
         $(this).css("background-color", "#ffffff").css("color", world.themeColor);
    });
}

//Document onload function
$(document).ready(function () {

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();

    initUI();
});