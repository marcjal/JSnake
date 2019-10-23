function $(elementName) {
  return document.getElementById(elementName);
}

function getInner(elementName) {
  let innerString = $(elementName).innerHTML;
  let innerInt = +innerString;
  return Number.isNaN(innerInt) ? innerString : innerInt;
}

function setInner(elementName, innerHtml) {
  return ($(elementName).innerHTML = innerHtml);
}

function appendInner(elementName, innerHtml) {
  return ($(elementName).innerHTML += innerHtml);
}

for (let i = 0; i < 8; i++) {
  let row = '<div class="gameRow">';
  for (let j = 0; j < 8; j++)
    row += `<div class="gameCol" id="r${i}c${j}"></div>`;
  row += "</div>";
  appendInner("gameArea", row);
}

let movingRight = false;
let movingDown = false;
let movingLeft = false;
let movingUp = false;

function setDirection([l, r, u, d]) {
  [movingLeft, movingRight, movingUp, movingDown] = [!!l, !!r, !!u, !!d];
}

setInner("score", 0);
setInner("highestScore", 0);
setInner("averageScore", 0);
setInner("gamesPlayed", 0);

let snakeColor = "#485922";
let foodColor = "#485922";

let row = -1;
let column = -1;

let snakePositions = [[0, 1], [0, 0]]; // [row, col]

function setCell() {
  $("r" + row + "c" + column).style["background"] = snakeColor;
}

function resetCell() {
  $("r" + row + "c" + column).style["background"] = "#485922";
}

function drawInitial() {
  for (let i = 0; i < snakePositions.length; i++) {
    row = snakePositions[i][0];
    column = snakePositions[i][1];
    setCell();
  }
}

let totalScore = 0;

function runGame() {
  setTimeout(() => {
    let head = snakePositions[0];

    if (movingRight) {
      column = head[1] + 1;
      row = head[0];
      if (column > 7) column = 0;
    } else if (movingDown) {
      column = head[1];
      row = head[0] + 1;
      if (row > 7) row = 0;
    } else if (movingLeft) {
      column = head[1] - 1;
      row = head[0];
      if (column < 0) column = 7;
    } else if (movingUp) {
      column = head[1];
      row = head[0] - 1;
      if (row < 0) row = 7;
    }

    setCell();
    if (snakePositions.some(e => e[0] == row && e[1] == column)) {
      $("gameOver").style.display = "block";
      setInner(
        "highestScore",
        Math.max(
          document.getElementById("highestScore").innerHTML,
          document.getElementById("score").innerHTML
        )
      );
      setInner("score", 0);
      setInner("gamesPlayed", getInner("gamesPlayed") + 1);
      setInner(
        "averageScore",
        Math.round(totalScore / getInner("gamesPlayed"))
      );
      setTimeout(() => ($("gameOver").style.display = "none"), 2000);
      for (let i = 0; i < snakePositions.length; i++) {
        row = snakePositions[i][0];
        column = snakePositions[i][1];
        resetCell();
      }
      snakePositions = [[0, 1], [0, 0]]; // [row, col]
      drawInitial();
      setDirection([, true, ,]);
    } else {
      snakePositions.unshift([row, column]);
      if (head.toString() == foodPosition.toString()) {
        setInner("score", getInner("score") + 1);
        totalScore++;
        positionFood();
      } else {
        let tail = snakePositions.pop();
        row = tail[0];
        column = tail[1];
        resetCell();
      }
    }

    runGame();
  }, 1000);
} // runGame

let foodPosition = [];

function positionFood() {
  foodPosition[0] = ~~(Math.random() * 8);
  foodPosition[1] = ~~(Math.random() * 8);
  if (
    !snakePositions.some(
      e => e[0] == foodPosition[0] || e[1] == foodPosition[1]
    )
  ) {
    $("r" + foodPosition[0] + "c" + foodPosition[1]).style[
      "background"
    ] = foodColor;
  } else positionFood();
}

row = 0;
movingRight = true;
drawInitial();
positionFood();
runGame();

let downKeys = ["ArrowDown", "j"];
let upKeys = ["ArrowUp", "k"];
let leftKeys = ["ArrowLeft", "h"];
let rightKeys = ["ArrowRight", "l"];

document.onkeydown = key => {
  if (leftKeys.includes(key.key) && !movingRight && !movingLeft)
    setDirection([true, , ,]);
  else if (rightKeys.includes(key.key) && !movingRight && !movingLeft)
    setDirection([, true, ,]);
  else if (upKeys.includes(key.key) && !movingDown && !movingUp)
    setDirection([, , true]);
  else if (downKeys.includes(key.key) && !movingDown && !movingUp)
    setDirection([, , , true]);
};

$("left").onclick = () => {
  setDirection([true, , ,]);
};
$("right").onclick = () => {
  setDirection([, true, ,]);
};
$("up").onclick = () => {
  setDirection([, , true]);
};
$("down").onclick = () => {
  setDirection([, , , true]);
};

$("turnOnColor").onclick = () => {
  snakeColor = "#B4BF5E";
  foodColor = "#2E3640";
  $("r" + foodPosition[0] + "c" + foodPosition[1]).style[
    "background"
  ] = foodColor;
};
