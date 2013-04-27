var canvas,
    ctx,
	highscore,
	pause = false,
    menutheme = new Audio("dokapi-bonus_tracks-01-space_odyssey_ambient.mp3"),
	battletheme = new Audio("SynthR - The Last Prophecy.mp3"),
	pewsound = new Audio("146725__fins__laser.wav"),
	explosion = new Audio("162792__timgormly__8-bit-explosion1.wav"),
    width = 1000,
    height = 600,
    enemyTotal = 20,
    enemies = [],
    enemy_x = 50,
    enemy_y = -45,
    enemy_w = 16,
    enemy_h = 30,
    speed = 10,
    enemy,
    rightKey = false,
    leftKey = false,
    upKey = false,
    downKey = false,
    ship,
    ship_x = (width / 2) - 25,
	ship_y = height - 75,
	ship_w = 32,
	ship_h = 24,
    laserTotal = 100,
    lasers = [],
    score = 0,
	level = 1,
    alive = true,
    health = 5,
    starfield,
    starX = 0, starY = 0, starY2 = -600,
    gameStarted = false;
	
for (var i = 0; i < enemyTotal; i++) {
	enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
	enemy_x = Math.random()*950;
}

function clearCanvas() {
	ctx.clearRect(0,0,width,height);
}

function gamePause() {
	pause = true;
	battletheme.pause();
}

function gameUnpause() {
	speed = 10;
	battletheme.play();
	pause = false;
}

function levelUp() {
if (level == 1) {
	enemyTotal = 50;
	level = 2;
	reset();	
}	
}
function drawEnemies() {
	for (var i = 0; i < enemies.length; i++) {
		ctx.drawImage(enemy, enemies[i][0], enemies[i][1]);
	}
}
function drawShip() {
	if (rightKey) ship_x += 10;
		else if (leftKey) ship_x -= 10;
	if (upKey) ship_y -= 10;
		else if (downKey) ship_y += 10;
	if (ship_x <= 0) ship_x = 0;
	if ((ship_x + ship_w) >= width) ship_x = width - ship_w;
	if (ship_y <= 0) ship_y = 0;
	if ((ship_y + ship_h) >= height) ship_y = height - ship_h;
	ctx.drawImage(ship, ship_x, ship_y);
}

function moveEnemies() {
	if (pause == false) {
		for (var i = 0; i < enemies.length; i++) {
			if (enemies[i][1] < height) {
			enemies[i][1] += enemies[i][4];
			} 
				else if (enemies[i][1] > height - 1) {
					enemies[i][1] = -45;
					enemies[i][0] = Math.random() * 950
					score = score - 1;
				}
		}
	}
}

function drawLaser() {
	if (lasers.length)
		for (var i = 0; i < lasers.length; i++) {
			ctx.fillStyle = '#9FEE00';
			ctx.fillRect(lasers[i][0],lasers[i][1],lasers[i][2],lasers[i][3])
		}
}

function moveLaser() {
	for (var i = 0; i < lasers.length; i++) {
		if (lasers[i][1] > -61) {
			lasers[i][1] -= 60;
		} 
			else if (lasers[i][1] < -60) {
			lasers.splice(i, 1);
			}
	}
}

function destroyEnemy(j) {
	explosion.play();
	enemies.splice(j, 1);
	enemies.push([(Math.random() * 950), -45, enemy_w, enemy_h, speed]);
}

function hitTest() {
	var remove = false;
	for (var i = 0; i < lasers.length; i++) {
		for (var j = 0; j < enemies.length; j++) {
			if (lasers[i][1] <= (enemies[j][1] + enemies[j][3]) && lasers[i][0] >= enemies[j][0] && lasers[i][0] <= (enemies[j][0] + enemies[j][2])) {
				destroyEnemy(j);
				remove = true;			
				score += 100;
				if (score == 10000) {
					levelUp();
				}
			}
		}
		if (remove == true) {
			lasers.splice(i, 1);
			remove = false;
		}
	}
}

function shipCollision() {
  var ship_xw = ship_x + ship_w,
      ship_yh = ship_y + ship_h;
  for (var i = 0; i < enemies.length; i++) {
   if (ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemy_w && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemy_h) {
     checkhealth();
	 destroyEnemy(i);
    }
    if (ship_xw < enemies[i][0] + enemy_w && ship_xw > enemies[i][0] && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemy_h) {
     checkhealth();
	 destroyEnemy(i);
    }
    if (ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemy_h && ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemy_w) {
     checkhealth();
	 destroyEnemy(i);
    }
    if (ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemy_h && ship_xw < enemies[i][0] + enemy_w && ship_xw > enemies[i][0]) {
     checkhealth();
	 destroyEnemy(i);
    }
  }
}

function checkhealth() {
  health -= 1;
  if (health == 0) alive = false;
}

function reset() {
  var enemy_reset_x = 50;
  ship_x = (width / 2) - 25, ship_y = height - 75, ship_w = 50, ship_h = 57;
  for (var i = 0; i < enemies.length; i++) {
   enemies[i][0] = enemy_reset_x;
   enemies[i][1] = -45;
   enemy_reset_x = enemy_reset_x + enemy_w + 60;
 }
}
function continueButton(e) {
 var cursorPos = getCursorPos(e);
 if (cursorPos.x > (width / 2) - 53 && cursorPos.x < (width / 2) + 47 && cursorPos.y > (height / 2) + 10 && cursorPos.y < (height / 2) + 50) {
   alive = true;
    health = 5;
	score = 0;
    reset();
    canvas.removeEventListener('click', continueButton, false);
	battletheme.currentTime=2;
  }
}

function cursorPosition(x,y) {
  this.x = x;
  this.y = y;
}

function getCursorPos(e) {
	var x;
	var y;
	if (e.pageX || e.pageY) {
		x = e.pageX;
		y = e.pageY;
	} 
		else {
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	var cursorPos = new cursorPosition(x, y);
	return cursorPos;
}
function scoreTotal() {
  ctx.font = 'bold 20px VT323';
  ctx.fillStyle = '#fff';
  ctx.fillText('Score: ', 10, 55);
  ctx.fillText(score, 70, 55);
  ctx.fillText('Highscore: ', 10, 80);
  ctx.fillText(highscore, 100, 80);
  ctx.fillText('Health:', 10, 30);
  ctx.fillText('Level: ', 850, 55);
  ctx.fillText(level, 910, 55);
	if (pause == false) {
		ctx.fillText('Press P to pause', 850, 30);
	}
	else {
		ctx.fillText('GAME PAUSED', 850, 30);
	}
	ctx.fillText(health, 75, 30);
        if (!gameStarted) {
    ctx.font = 'bold 30px VT323';
    ctx.fillText('Super Space Shooter (By Moon Quddus)', width / 2 - 230, height / 2);
    ctx.font = '20px VT323';
    ctx.fillText('Click to Play', width / 2 - 56, height / 2 + 30);
    ctx.fillText('Arrow keys to move, x to shoot', width / 2 - 125, height / 2 + 60);
  }
  if (!alive) {
	if (score > highscore) highscore = score;
	localStorage.setItem('LLEUADIWPS3HS', highscore);
    ctx.fillText('Game Over!', 445, height / 2);
    ctx.fillRect((width / 2) - 60, (height / 2) + 10,100,40);
    ctx.fillStyle = '#000';
    ctx.fillText('Continue?', 450, (height / 2) + 40);
    canvas.addEventListener('click', continueButton, false);
  }
}
function drawStarfield() {
  ctx.drawImage(starfield,starX,starY);
  ctx.drawImage(starfield,starX,starY2);
  if (starY > 600) {
    starY = -599;
  }
  if (starY2 > 600) {
    starY2 = -599;
  }
  starY += 5;
  starY2 += 5;
}

function gameStart() {
  gameStarted = true;
  canvas.removeEventListener('click', gameStart, false);
  menutheme.pause();
  battletheme.currentTime = 2;
  battletheme.play();
}

function gameLoop() {
  clearCanvas();
  drawStarfield()
  if (alive && gameStarted && health > 0) {
   hitTest();
    shipCollision();
    moveLaser();
    moveEnemies();
    drawEnemies();
    drawShip();
    drawLaser();
  }
  scoreTotal();
  game = setTimeout(gameLoop, 1000 / 30);
}

function keyDown(e) {
	if (pause == false) {
		if (e.keyCode == 39) rightKey = true;
		else if (e.keyCode == 37) leftKey = true;
		if (e.keyCode == 38) upKey = true;
		else if (e.keyCode == 40) downKey = true;
		if (e.keyCode == 88 && lasers.length <= laserTotal) {
			pewsound.play();
			lasers.push([ship_x + 22, ship_y - 5, 2, 10]);
			lasers.push([ship_x + 10, ship_y - 5, 2, 10]);
		}
		if (e.keyCode == 80) gamePause();
	}
	else {
		if (e.keyCode == 80) gameUnpause();
	}
}

function keyUp(e) {
	if (e.keyCode == 39) rightKey = false;
		else if (e.keyCode == 37) leftKey = false;
	if (e.keyCode == 38) upKey = false;
	else if (e.keyCode == 40) downKey = false;
}

function init() {
	if (localStorage.getItem('LLEUADS3HS') === null) {
		highscore = 0;
	}
	else {
		highscore = parseInt(localStorage.getItem('LLEUADS3HS'));
	}
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  enemy = new Image();
  enemy.src = 'enemy.png';
  ship = new Image();
  ship.src = 'player.png';
  starfield = new Image();
  starfield.src = 'space.png';
  menutheme.play();
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
        canvas.addEventListener('click', gameStart, false);
  gameLoop();
}

window.onload = init;