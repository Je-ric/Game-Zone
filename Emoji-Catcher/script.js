const tiles = document.querySelectorAll(".tile");
    const timerDisplay = document.querySelector("#timer-display");
    const scoreDisplay = document.querySelector("#score-display");
    const startButton = document.querySelector("#start-button");

    let score = 0;
    let activeTileId;
    let timeRemaining = 60;
    let emojiIntervalId = null;
    let countdownIntervalId = null;
    let isGameActive = false;

    function showRandomEmoji() {
      tiles.forEach(tile => tile.classList.remove("active-emoji"));
      const randomIndex = Math.floor(Math.random() * tiles.length);
      const selectedTile = tiles[randomIndex];
      selectedTile.classList.add("active-emoji");
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
          alert(`Game Over! Final Score: ${score}`);
        }
      }, 1000);
    }

    startButton.addEventListener("click", () => {
      if (isGameActive) return;

      score = 0;
      timeRemaining = 60;
      scoreDisplay.textContent = score;
      timerDisplay.textContent = timeRemaining;
      isGameActive = true;

      startEmojiLoop();
      startCountdown();
    });