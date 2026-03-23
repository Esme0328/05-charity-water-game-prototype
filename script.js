const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const gameArea = document.getElementById("game-area");
const message = document.getElementById("message");

let score = 0;
let timeLeft = 20;
let gameRunning = false;
let timerId = null;
let audioContext = null;

// Milestone messages appear when the player reaches these exact scores.
const milestones = [
  { score: 5, message: "Great start!" },
  { score: 10, message: "Halfway there!" },
  { score: 15, message: "Amazing focus!" },
  { score: 20, message: "Water hero level unlocked!" }
];

// create the water drop
const waterDrop = document.createElement("img");
waterDrop.src = "img/water-can-transparent.png";
waterDrop.alt = "Water can target";
waterDrop.className = "water-drop";

gameArea.appendChild(waterDrop);

function setButtonState() {
  startBtn.disabled = gameRunning;
}

// Create the audio context only when needed (browser-friendly for user gestures).
function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }

  return audioContext;
}

// Play a short pop sound when the player scores.
function playScoreSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(650, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);

  gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.1);
}

// move to random position
function moveDrop() {
  const targetWidth = waterDrop.offsetWidth || 70;
  const x = Math.random() * (gameArea.clientWidth - targetWidth);
  const y = Math.random() * (gameArea.clientHeight - targetWidth);

  waterDrop.style.left = x + "px";
  waterDrop.style.top = y + "px";
}

// start game
startBtn.addEventListener("click", () => {
  // If the game is already running, avoid creating another timer.
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeLeft = 20;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  message.textContent = "Game started! Click the water 💧";
  setButtonState();

  waterDrop.style.display = "block";
  moveDrop();

  // Count down once per second until time reaches 0.
  timerId = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      timerId = null;
      gameRunning = false;
      waterDrop.style.display = "none";
      message.textContent = `Time's up! Final score: ${score}`;
      setButtonState();
    }
  }, 1000);
});

// click event
waterDrop.addEventListener("click", () => {
  if (!gameRunning) return;

  score++;
  playScoreSound();
  scoreDisplay.textContent = score;

  // Check whether the new score matches a milestone score.
  const milestoneHit = milestones.find((milestone) => {
    return milestone.score === score;
  });

  if (milestoneHit) {
    message.textContent = milestoneHit.message;
  } else {
    message.textContent = "+1 point!";
  }

  moveDrop();
});

// reset game
resetBtn.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  gameRunning = false;
  score = 0;
  timeLeft = 20;

  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  waterDrop.style.display = "none";
  message.textContent = "Press start to begin.";
  setButtonState();
});

setButtonState();
