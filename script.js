const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("start-btn");
const gameArea = document.getElementById("game-area");
const message = document.getElementById("message");

let score = 0;
let gameRunning = false;

// create the water drop
const waterDrop = document.createElement("div");
waterDrop.textContent = "💧";
waterDrop.style.position = "absolute";
waterDrop.style.fontSize = "40px";
waterDrop.style.cursor = "pointer";
waterDrop.style.display = "none";

gameArea.appendChild(waterDrop);

// move to random position
function moveDrop() {
  const x = Math.random() * (gameArea.clientWidth - 40);
  const y = Math.random() * (gameArea.clientHeight - 40);

  waterDrop.style.left = x + "px";
  waterDrop.style.top = y + "px";
}

// start game
startBtn.addEventListener("click", () => {
  gameRunning = true;
  score = 0;
  scoreDisplay.textContent = score;
  message.textContent = "Game started! Click the water 💧";

  waterDrop.style.display = "block";
  moveDrop();
});

// click event
waterDrop.addEventListener("click", () => {
  if (!gameRunning) return;

  score++;
  scoreDisplay.textContent = score;
  message.textContent = "+1 point!";

  moveDrop();
});
