const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playAgainBtn = document.getElementById("playAgainBtn");

const box = 25;
let alien, direction, fruit, score, game;

function initGame() {
  alien = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  score = 0;
  fruit = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
  };
  playAgainBtn.style.display = "none";
  game = setInterval(draw, 250);
}

document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function drawAlienSegment(x, y, isHead) {
  const gradient = ctx.createRadialGradient(x+box/2, y+box/2, 5, x+box/2, y+box/2, box/2);
  gradient.addColorStop(0, isHead ? "#00ffea" : "#39ff14");
  gradient.addColorStop(1, "#003300");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x + box/2, y + box/2, box/2, 0, Math.PI * 2);
  ctx.fill();

  if (isHead) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x + box/3, y + box/3, 3, 0, Math.PI * 2); // eye
    ctx.arc(x + 2*box/3, y + box/3, 3, 0, Math.PI * 2); // eye
    ctx.fill();
  }
}

function drawFruit(x, y) {
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.arc(x + box/2, y + box/2, box/2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "green";
  ctx.fillRect(x + box/2 - 2, y - 5, 4, 8); // stem
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw alien
  for (let i = 0; i < alien.length; i++) {
    drawAlienSegment(alien[i].x, alien[i].y, i === 0);
  }

  // Draw fruit
  drawFruit(fruit.x, fruit.y);

  // Movement
  let alienX = alien[0].x;
  let alienY = alien[0].y;
  if (direction === "LEFT") alienX -= box;
  if (direction === "UP") alienY -= box;
  if (direction === "RIGHT") alienX += box;
  if (direction === "DOWN") alienY += box;

  // Eating fruit
  if (alienX === fruit.x && alienY === fruit.y) {
    score++;
    fruit = {
      x: Math.floor(Math.random() * 19 + 1) * box,
      y: Math.floor(Math.random() * 19 + 1) * box
    };
  } else {
    alien.pop();
  }

  const newHead = { x: alienX, y: alienY };

  // Game over
  if (
    alienX < 0 || alienY < 0 ||
    alienX >= canvas.width || alienY >= canvas.height ||
    collision(newHead, alien)
  ) {
    clearInterval(game);
    playAgainBtn.style.display = "block";
    return;
  }

  alien.unshift(newHead);

  // Score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, box, box);
}

function collision(head, array) {
  return array.some(segment => head.x === segment.x && head.y === segment.y);
}

playAgainBtn.addEventListener("click", initGame);

// Start game
initGame();
