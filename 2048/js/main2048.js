var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;


$(document).ready(function() {
	prepareForMobile();
	newgame();
});

function prepareForMobile() {
	if (documentWidth > 500) {
		gridContainerWidth = 500;
		cellSideLength = 100;
		cellSpace = 20;
	}

	$("#grid-container").css('width', gridContainerWidth - 2 * cellSpace);
	$("#grid-container").css('height', gridContainerWidth - 2 * cellSpace);
	$("#grid-container").css('padding', cellSpace);
	$("#grid-container").css('border-radius', 0.02 * gridContainerWidth);

	$(".grid-cell").css('width', cellSideLength);
	$(".grid-cell").css('height', cellSideLength);
	$(".grid-cell").css('border-radius', 0.02 * cellSideLength);


}

function newgame() {
	//初始化棋盘格
	init();
	//在随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init() {
	var i = 0;
	var j = 0;
	for (i = 0; i < 4; i++)
		for (j = 0; j < 4; j++) {
			var gridCell = $("#grid-cell-" + i + "-" + j);
			gridCell.css('top', getPosTop(i, j));
			gridCell.css('left', getPosLeft(i, j));
		}

	for (i = 0; i < 4; i++) {
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for (j = 0; j < 4; j++) {
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}

	updateBoardView();

	score = 0;
}

function updateBoardView() {
	$(".number-cell").remove();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
			var numberCell = $('#number-cell-' + i + '-' + j);
			if (board[i][j] === 0) {
				numberCell.css('width', '0px');
				numberCell.css('height', '0px');
				numberCell.css('top', getPosTop(i, j) + cellSideLength / 2);
				numberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
			} else {
				numberCell.css('width', cellSideLength);
				numberCell.css('height', cellSideLength);
				numberCell.css('top', getPosTop(i, j));
				numberCell.css('left', getPosLeft(i, j));
				numberCell.css('background-color', getNumberCellBackgroundColor(board[i][j]));
				numberCell.css('color', getNumberCellColor(board[i][j]));
				numberCell.text(board[i][j]);
			}
			hasConflicted[i][j] = false;
		}
	}
	$(".number-cell").css('line-height', cellSideLength + 'px');
	$(".number-cell").css('font-size', 0.4 * cellSideLength + 'px');
}

function generateOneNumber() {
	if (nospace(board))
		return false;
	//随机一个位置
	var randx = parseInt(Math.floor(Math.random() * 4));
	var randy = parseInt(Math.floor(Math.random() * 4));
	var times = 0;
	while (times < 50) {
		if (board[randx][randy] === 0)
			break;
		randx = parseInt(Math.floor(Math.random() * 4));
		randy = parseInt(Math.floor(Math.random() * 4));
		times++;
	}

	if (times === 50) {
		var flag = 0;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (board[i][j] === 0) {
					randx = i;
					randy = j;
					flag = 1;
					break;
				}
			}
			if (flag === 1)
				break;
		}
	}
	//随机生成一个数字
	var randNumber = Math.random() < 0.8 ? 2 : 4;
	//在随机位置显示随机数
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx, randy, randNumber);
	return true;
}

$(document).keydown(function(event) {
	switch (event.keyCode) {
		case 37: //left
			event.preventDefault();
			if (moveLeft()) {
				setTimeout(generateOneNumber, 210);
				setTimeout(isGameOver, 300);
			}
			// return false;
			break;
		case 38: //up
			event.preventDefault();
			if (moveUp()) {
				setTimeout(generateOneNumber, 210);
				setTimeout(isGameOver, 300);
			}
			// return false;
			break;
		case 39: //right
			event.preventDefault();
			if (moveRight()) {
				setTimeout(generateOneNumber, 210);
				setTimeout(isGameOver, 300);
			}
			// return false;
			break;
		case 40: //down
			event.preventDefault();
			if (moveDown()) {
				setTimeout(generateOneNumber, 210);
				setTimeout(isGameOver, 300);
			}
			// return false;
			break;
		default:
			break;
	}
});

document.addEventListener('touchstart', function(event) {
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

document.addEventListener('touchmove', function(event) {
	event.preventDefault();
});

document.addEventListener('touchend', function(event) {
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
	var dx = endx - startx;
	var dy = endy - starty;
	if (Math.abs(dx) >= Math.abs(dy)) {
		if (dx !== 0) {
			if (dx > 0) {
				//right
				if (moveRight()) {
					setTimeout(generateOneNumber, 210);
					setTimeout(isGameOver, 300);
				}
			} else {
				//left
				if (moveLeft()) {
					setTimeout(generateOneNumber, 210);
					setTimeout(isGameOver, 300);
				}
			}
		}
	} else {
		if (dy !== 0) {
			if (dy > 0) {
				//down
				if (moveDown()) {
					setTimeout(generateOneNumber, 210);
					setTimeout(isGameOver, 300);
				}
			} else {
				//up
				if (moveUp()) {
					setTimeout(generateOneNumber, 210);
					setTimeout(isGameOver, 300);
				}
			}
		}
	}
});

function isGameOver() {
	if (nospace(board) && !canMove(board))
		alert("game over");
}

function moveLeft() {
	if (!canMoveLeft(board))
		return false;
	//move left
	score = 0;
	for (var i = 0; i < 4; i++)
		for (var j = 1; j < 4; j++) {
			if (board[i][j] !== 0) {
				for (var k = 0; k < j; k++) {
					if (board[i][k] === 0 && noBlockHorizontal(i, k, j, board)) {
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[i][k] === board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
						showMoveAnimation(i, j, i, k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						score += board[i][k];
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	updateScore(score);
	setTimeout(updateBoardView, 200);
	return true;
}

function moveUp() {
	if (!canMoveUp(board))
		return false;
	//move up
	score = 0;
	for (var i = 0; i < 4; i++)
		for (var j = 1; j < 4; j++) {
			if (board[j][i] !== 0) {
				for (var k = 0; k < j; k++) {
					if (board[k][i] === 0 && noBlockVertical(i, k, j, board) && !hasConflicted[k][i]) {
						showMoveAnimation(j, i, k, i);
						board[k][i] = board[j][i];
						board[j][i] = 0;
						continue;
					} else if (board[k][i] === board[j][i] && noBlockVertical(i, k, j, board)) {
						showMoveAnimation(j, i, k, i);
						board[k][i] += board[j][i];
						board[j][i] = 0;
						score += board[k][i];
						hasConflicted[k][i] = true;
						continue;
					}
				}
			}
		}
	updateScore(score);
	setTimeout(updateBoardView, 200);
	return true;
}

function moveRight() {
	if (!canMoveRight(board))
		return false;
	//move right
	score = 0;
	for (var i = 0; i < 4; i++)
		for (var j = 2; j >= 0; j--) {
			if (board[i][j] !== 0) {
				for (var k = 3; k > j; k--) {
					if (board[i][k] === 0 && noBlockHorizontal(i, j, k, board)) {
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[i][k] === board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
						showMoveAnimation(i, j, i, k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						score += board[i][k];
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	updateScore(score);
	setTimeout(updateBoardView, 200);
	return true;
}

function moveDown() {
	if (!canMoveDown(board))
		return false;
	//move up
	score = 0;
	for (var i = 0; i < 4; i++)
		for (var j = 2; j >= 0; j--) {
			if (board[j][i] !== 0) {
				for (var k = 3; k > j; k--) {
					if (board[k][i] === 0 && noBlockVertical(i, j, k, board)) {
						showMoveAnimation(j, i, k, i);
						board[k][i] = board[j][i];
						board[j][i] = 0;
						continue;
					} else if (board[k][i] === board[j][i] && noBlockVertical(i, j, k, board) && !hasConflicted[k][i]) {
						showMoveAnimation(j, i, k, i);
						board[k][i] += board[j][i];
						board[j][i] = 0;
						score += board[k][i];
						hasConflicted[k][i] = true;
						continue;
					}
				}
			}
		}
	updateScore(score);
	setTimeout(updateBoardView, 200);
	return true;
}