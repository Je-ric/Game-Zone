const colorDisplay = document.getElementById("colorDisplay");
const choicesContainer = document.getElementById("choices");
const scoreDisplay = document.getElementById("score");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");
const difficultySelect = document.getElementById("difficulty");
const timerProgress = document.getElementById("timerProgress");
const timerText = document.getElementById("timerText");

let score = 0;
let correctColor = "";
let disableClicks = false;
let timerInterval = null;
const nextRoundDelay = 2500; // 2.5 seconds

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Function to generate a random RGB color
function generateRandomRGB() {
    const r = getRandomInt(256);
    const g = getRandomInt(256);
    const b = getRandomInt(256);
    return `rgb(${r}, ${g}, ${b})`;
}

// Convert RGB to Hex
function rgbToHex(rgb) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function startTimer(duration) {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerProgress.style.width = "100%";
    timerText.textContent = "";
    timerProgress.style.display = "none";

    if (disableClicks) {
        timerProgress.style.display = "block";
        
        const startTime = Date.now();
        const endTime = startTime + duration;
        
        timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const timeLeft = Math.max(0, endTime - currentTime);
        const progress = (timeLeft / duration) * 100;
        
        timerProgress.style.width = `${progress}%`;
        timerText.textContent = `${(timeLeft / 1000).toFixed(1)}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
        }
        }, 100);
    }
}

function startGame() {
    disableClicks = false;
    choicesContainer.innerHTML = "";
    message.textContent = "";
    message.className = "";

    startTimer(nextRoundDelay);

    const difficulty = parseInt(difficultySelect.value);
    const colors = Array.from({ length: difficulty }, generateRandomRGB);

    // Randomly color
    correctColor = colors[getRandomInt(colors.length)];

    const correctColorHex = rgbToHex(correctColor);

    // Display the color and its RGB & HEX values
    colorDisplay.innerHTML = `
        <strong>Guess this color:</strong><br>
        <span class="color-value">${correctColor}</span><br>
        <span class="hex-value">HEX: ${correctColorHex}</span>
    `;

    // Create buttons for each color
    colors.forEach((color) => {
        const btn = document.createElement("button");
        btn.className = "colorBtn";
        btn.style.backgroundColor = color;
        btn.dataset.color = color;

        btn.addEventListener("click", () => {
        if (disableClicks) return;

        disableClicks = true;

        // Check if the clicked color is the correct one
        if (color === correctColor) {
            message.textContent = "✅ Correct!";
            message.className = "correct";
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
        } else {
            message.textContent = "❌ Wrong!";
            message.className = "wrong";

            // Highlight the correct color
            const allButtons = document.querySelectorAll(".colorBtn");
            allButtons.forEach((b) => {
            if (b.dataset.color === correctColor) {
                b.style.outline = "4px solid var(--success)";
                b.style.boxShadow = "0 0 15px var(--success)";
            }
            });
        }

        // Start the timer for the next round
        startTimer(nextRoundDelay);

        // Wait for 2.5 seconds, then start the next game
        setTimeout(startGame, nextRoundDelay);
        });

        choicesContainer.appendChild(btn);
    });
}

restartBtn.addEventListener("click", () => {
    score = 0;
    scoreDisplay.textContent = "Score: 0";
    startGame();
});

difficultySelect.addEventListener("change", startGame);

startGame();