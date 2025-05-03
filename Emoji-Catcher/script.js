const tiles = document.querySelectorAll(".tile");
const timerDisplay = document.querySelector("#timer-display");
const scoreDisplay = document.querySelector("#score-display");
const startButton = document.querySelector("#start-button");
const emojiModeInputs = document.querySelectorAll("input[name='emojiMode']");
const timeSelect = document.querySelector("#time-select");
const restartButton = document.getElementById("restart-button");


let score = 0;
let activeTileId;
let timeRemaining = 60;  
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


emojiModeInputs.forEach(input => {
    input.addEventListener("change", (e) => {
        emojiMode = e.target.value;
    });
});


timeSelect.addEventListener("change", (e) => {
    timeRemaining = parseInt(e.target.value);
    timerDisplay.textContent = timeRemaining; 
});

function showRandomEmoji() {
    tiles.forEach(tile => tile.style.backgroundImage = ""); 
    
    const randomTileIndex = Math.floor(Math.random() * tiles.length);
    const selectedTile = tiles[randomTileIndex];
  
    let emojiToUse = selectedEmoji;
  
    
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
        endGame(); 
      }
    }, 1000);
  }

startButton.addEventListener("click", () => {
  if (isGameActive) return;

  score = 0;
  
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


function startGame() {
    
    isGameActive = true;
    startEmojiLoop();
    startCountdown();
  }
   
  function endGame() {
    clearInterval(countdownIntervalId);
    clearInterval(emojiIntervalId);
    isGameActive = false;

    document.querySelector("#final-score").textContent = score;
  
    const gameOverModal = document.getElementById("game-over-modal");
    gameOverModal.classList.remove("hidden");
    gameOverModal.classList.add("show");
}

  
  
  document.getElementById("restart-button").addEventListener("click", () => {
    
    score = 0;
    timeRemaining = parseInt(timeSelect.value); 
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeRemaining;
    activeTileId = null;
  
    
    const gameOverModal = document.getElementById("game-over-modal");
    gameOverModal.classList.remove("show");
    gameOverModal.classList.add("hidden"); 
  
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
