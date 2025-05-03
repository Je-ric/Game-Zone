const tiles = document.querySelectorAll(".tile");
const timerDisplay = document.querySelector("#timer-display");
const scoreDisplay = document.querySelector("#score-display");
const startButton = document.querySelector("#start-button");
const emojiModeInputs = document.querySelectorAll("input[name='emojiMode']");
const timeSelect = document.querySelector("#time-select");
const restartButton = document.getElementById("restart-button");


let score = 0;
let activeTileId;
let timeRemaining = 60;  // Default time is 60 seconds
let emojiIntervalId = null;
let countdownIntervalId = null;
let isGameActive = false;

const emojiImages = [
    "images/disappointed_relieved.png",
    "images/exploding_head.png",
    "images/expressionless.png",
    "images/face_with_cowboy_hat.png",
    "images/face_with_symbols_on_mouth.png",
    "images/face_with_rolling_eyes.png",
    "images/heart_eyes.png",
    "images/innocent.png",
    "images/kissing_closed_eyes.png",
    "images/kissing_heart.png",
    "images/money_mouth_face.png",
    "images/nauseated_face.png",
    "images/nerd_face.png",
    "images/scream.png",
    "images/sleeping.png",
    "images/sob.png",
    "images/star-struck.png",
    "images/stuck_out_tongue_closed_eyes.png",
    "images/sunglasses.png",
    "images/sweat_smile.png",
    "images/zany_face.png"
];

let selectedEmoji = emojiImages[0];
let emojiMode = "single";

// Emoji Mode Listener
emojiModeInputs.forEach(input => {
    input.addEventListener("change", (e) => {
        emojiMode = e.target.value;
    });
});

// Time Limit Selection
timeSelect.addEventListener("change", (e) => {
    timeRemaining = parseInt(e.target.value);
    timerDisplay.textContent = timeRemaining; // Update the displayed time
});

function showRandomEmoji() {
    tiles.forEach(tile => tile.style.backgroundImage = ""); // Reset tiles
    
    const randomTileIndex = Math.floor(Math.random() * tiles.length);
    const selectedTile = tiles[randomTileIndex];
  
    let emojiToUse = selectedEmoji;
  
    // If random mode is selected, choose a random emoji
    if (emojiMode === "random") {
      const randomEmojiIndex = Math.floor(Math.random() * emojiImages.length);
      emojiToUse = emojiImages[randomEmojiIndex];
    }
  
    selectedTile.style.backgroundImage = `url('${emojiToUse}')`;
    selectedTile.style.backgroundSize = "cover";
    selectedTile.style.backgroundPosition = "center";
    activeTileId = selectedTile.id;
}

tiles.forEach(tile => {
  tile.addEventListener("mousedown", () => {
    if (!isGameActive) return;
    if (tile.id === activeTileId) {
      score++;
      scoreDisplay.textContent = score;
      activeTileId = null;
    }
  });
});

function startEmojiLoop() {
  emojiIntervalId = setInterval(showRandomEmoji, 600);
}

function startCountdown() {
    countdownIntervalId = setInterval(() => {
      timeRemaining--;
      timerDisplay.textContent = timeRemaining;
  
      if (timeRemaining === 0) {
        clearInterval(countdownIntervalId);
        clearInterval(emojiIntervalId);
        isGameActive = false;
        endGame(); // Show the modal instead of alert
      }
    }, 1000);
  }

startButton.addEventListener("click", () => {
  if (isGameActive) return;

  score = 0;
  // Get the time from the time select dropdown
  timeRemaining = parseInt(timeSelect.value);
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeRemaining;
  isGameActive = true;

  if (emojiMode === "single") {
    const randomEmojiIndex = Math.floor(Math.random() * emojiImages.length);
    selectedEmoji = emojiImages[randomEmojiIndex];
  }

  startEmojiLoop();
  startCountdown();
});

// Function to start the game logic
function startGame() {
    // Reset game state before starting
    isGameActive = true;
    startEmojiLoop();
    startCountdown();
  }
   
  function endGame() {
    clearInterval(countdownIntervalId);
    clearInterval(emojiIntervalId);
    isGameActive = false;
  
    // Set the final score in the modal
    document.querySelector("#final-score").textContent = score;
  
    // Show the game over modal
    const gameOverModal = document.getElementById("game-over-modal");
    gameOverModal.classList.remove("hidden"); // Make the modal visible
  
    saveHighScore();
  }
  
  document.getElementById("restart-button").addEventListener("click", () => {
    // Reset game state
    score = 0;
    timeRemaining = parseInt(timeSelect.value); // Reset to selected time
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeRemaining;
    activeTileId = null;
  
    // Hide the game over modal and restart the game
    document.getElementById("game-over-modal").classList.add("hidden");
    clearInterval(countdownIntervalId);
    clearInterval(emojiIntervalId);
    startGame();
  });
  

function saveHighScore() {
  const highScore = localStorage.getItem("highScore") || 0;
  if (score > highScore) {
    localStorage.setItem("highScore", score);
    alert("New High Score!");
  }
}
