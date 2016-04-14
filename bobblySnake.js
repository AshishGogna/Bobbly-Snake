//The World
var maxWidth = 0;
var maxHeight = 0;

var score = 0;
var speed = 1;

var gameStarted = 0;

var world = {
    ctx:null,
    fps:20 //new frame every 0.5 seconds
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

    world.ctx.strokeStyle = '#fe57a1';
    world.ctx.strokeRect(0, 0, maxWidth-1, maxHeight-1);

    //Escape routes
    //escapeRoutes.init();

    snake.init();
    //Start moving the snake
    //setInterval(snake.move, world.frameLength);
}
window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
    window.setTimeout(callback, 100 / 60);
};
})();

/*
//Escape Routs
var escapeRoutes = {
    escapeRects:[]
}
escapeRoutes.init = function()
{
    //Escape rects
    escapeRoutes.escapeRects.push([50, 0, 60, 1]);
    escapeRoutes.escapeRects.push([600, maxHeight-2, 60, 2]);
    escapeRoutes.escapeRects.push([0, 230, 1, 70]);
    escapeRoutes.escapeRects.push([maxWidth-2, 230, 2, 70]);

    for (var i=0; i<escapeRoutes.escapeRects.length; i++)
    {
        var eRect = escapeRoutes.escapeRects[i]; 
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(eRect[0], eRect[1], eRect[2], eRect[3]);
    }
}
*/

//The Snake
var snake = {
    blockSize:20,
    direction:"right",
    blocks:[],
    headBang:0
}
snake.init = function()
{
    world.ctx.fillStyle = '#fe57a1';

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
    world.ctx.clearRect(1, 1, maxWidth-3, maxHeight-3); //clear the canvas

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
            world.ctx.fillStyle = '#fe57a1';

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

        var delay=1000; //1 second

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
            // Drawing code goes here
        }, 1000 / world.fps);
    }
}

snake.detectCollision = function()
{
    //Food collision
    var lastBlock = snake.blocks[snake.blocks.length-1];

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
            snake.direction = "up";
        if (ch == "a")
            snake.direction = "left";
        if (ch == "s")
            snake.direction = "down";
        if (ch == "d")
            snake.direction = "right";
    }
});

function updateScore()
{
    $('#scoreDiv').html("Score: " + score);
    $('#speedDiv').html("Speed: " + Math.round(speed * 100) / 100 + "x");
}

function restartGame()
{
    location.reload();
    //snake.init = [];
}
function initGame()
{
    console.log("BBB");
    maxWidth = $('#gameDiv').width();
    maxHeight = $('#gameDiv').height();

    $('#gameDiv').append('<div id="scoreDiv">Score: 0</div>');
    $('#gameDiv').append('<div id="speedDiv">Speed: 1x</div><br>');
    world.init();
}

function initUI()
{
    $('#gameDiv').append('<div id="menu"><div id="buttons"><button onclick="startGame()">Start Game</button><button onclick="instructions()">Instructions</button></div></div>');
}

function startGame()
{
    $( "#menu" ).remove();
    gameStarted = 0;
    initGame();
}

function instructions()
{
    $( "#menu" ).remove();
    $('#gameDiv').append('<div id="instructions"><div id="instructionsContent"><h3>How to play ?</h3><h4>Movement controls</h4>W = Up<br>D = Right<br>S = Down<br>A = Left<br><h4>Difficulty</h4>The speed of snake increases 0.1x when snake eats the food. At the same time, the score gets incrementedS too.</div></div>');
}

$(document).ready(function () {

    initUI();
    //initGame();
});