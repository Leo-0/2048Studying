function showNumberWithAnimation(i, j, randNumber) {
	var numberCell = $("#number-cell-" + i + "-" + j);
	numberCell.css("background-color", getNumberCellBackgroundColor(randNumber));
	numberCell.css("color", getNumberCellColor(randNumber));
	numberCell.text(randNumber);
	numberCell.animate({
		width: cellSideLength,
		height: cellSideLength,
		top: getPosTop(i, j),
		left: getPosLeft(i, j)
	}, 50);
}

function showMoveAnimation(fromx, fromy, tox, toy) {
	var numberCell = $('#number-cell-' + fromx + '-' + fromy);
	numberCell.animate({
		top: getPosTop(tox, toy),
		left: getPosLeft(tox, toy)
	}, 200);
}

function updateScore(score) {
	$("#score").text(parseInt($("#score").html()) + score);
}