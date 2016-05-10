$(document).ready(function() {
	
	var canvas = $('#myCanvas')[0];
	var ctx = canvas.getContext('2d');
	var width = canvas.width;
	var height = canvas.height;
	var cellWidth = 15;
	var direction = "right";
	var food;
	var score;
	var color = "#00ff00";
	var speed = 50;
	
	//Snake Array
	var snakeArray;

	//Initialize
	function init() {
		direction = "right";
		createSnake();
		createFood();
		score = 0;

		if(typeof gameLoop != "undefined") 
			clearInterval(gameLoop);

		//trigger paint function at regular interval
		gameLoop = setInterval(paint, speed);

	}

	init();

	//Create Snake function
	function createSnake() {
		var length = 5;
		snakeArray = [];

		for(var i = length-1; i >= 0; i--) {
			snakeArray.push({x:i, y:0});
		}
	}

	//Create Food 
	function createFood() {
		food = {
			x:Math.round(Math.random() * (width-cellWidth)/cellWidth),
			y:Math.round(Math.random() * (height-cellWidth)/cellWidth)
		};
	}

	//Paint Snake
	function paint() {
		//Canvas
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, width, height);
		ctx.strokeStyle = "#ffffff";
		ctx.strokeRect(0, 0, width, height);

		var nextX = snakeArray[0].x;
		var nextY = snakeArray[0].y;

		//Directions
		if(direction == "right") nextX++;
		else if(direction == "left") nextX--;
		else if(direction == "up") nextY--;
		else if(direction == "down") nextY++;

		//collision with box or body
		if(nextX == -1 || nextX == width/cellWidth || nextY == -1 || 
			nextY == height/cellWidth || checkCollision(nextX, nextY, snakeArray)) {
			//init();
			//Insert Score
			$('#final-score').html(score);
			$('#overlay').fadeIn(300);
			return;
		}

		//Eat food
		if(nextX == food.x && nextY == food.y) {
			var tail = {
				x:nextX,
				y:nextY
			};
			score++;

			//CreateFood
			createFood();
		} else {
			var tail = snakeArray.pop();
			tail.x = nextX;
			tail.y = nextY;
		}

		snakeArray.unshift(tail);

		for(var i = 0; i < snakeArray.length; i++) {
			var c = snakeArray[i];
			paintCell(c.x, c.y);
		} 

		//Paint Cell
		paintCell(food.x,food.y);

		//CheckScore
		checkScore(score);

		//Display Current Score
		$('#score').html('Your Score : ' + score); 
	}

	function paintCell(x, y) {
		ctx.fillStyle = color;
		ctx.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
		ctx.strokeStyle = "#ffffff";
		ctx.strokeRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);

	}

	function checkCollision(x, y, array) {
		for(var i = 0; i < array.length; i++) {
			if(array[i].x == x && array[i].y == y) {
				return true;
			}
		}
		return false;
	}

	//Check Score
	function checkScore(score) {
		if(localStorage.getItem('highscore') == null) {
			//if there is no high score
			localStorage.setItem('highscore', score); 
		} else {
			//there is a highscore
			if(score > localStorage.getItem('highscore')) {
				localStorage.setItem('highscore', score);
			}
		}

		$('#high-score').html('High Score : ' + localStorage.getItem('highscore'));
	}

	//KeyBoard Controller
	$(document).keydown(function(e) {
		var key = e.which;

		if(key == "37" && direction != "right") direction = "left";
		else if(key == "38" && direction != "down") direction = "up";
		else if(key == "39" && direction != "left") direction = "right";
		else if(key == "40" && direction != "up") direction = "down";

	});
});

function resetScore() {
	localStorage.setItem('highscore', 0);

	var highscoreDiv = document.getElementById('#high-score');

	highscoreDiv.innerHTML(localStorage.highscore);
}