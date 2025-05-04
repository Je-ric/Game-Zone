let randomNumber;
let maxTries;
let maxRange;
let guessCount;
let guesses = [];

function startGame() {
  const rangeSelected = document.querySelector('input[name="range"]:checked');
  const attemptSelected = document.querySelector('input[name="attempt"]:checked');

  if (!rangeSelected || !attemptSelected) {
    alert("Select both range and guesses.");
    return;
  }

  maxRange = parseInt(rangeSelected.value);
  maxTries = parseInt(attemptSelected.value);

  randomNumber = Math.floor(Math.random() * maxRange) + 1;
  guessCount = 0;
  guesses = [];

  document.getElementById("feedback").innerText = '';
  document.getElementById("guessList").innerText = '';
  document.getElementById("gameArea").classList.remove("hidden");

  console.log("Secret number:", randomNumber);
}

function checkGuess() {
var guess = parseInt(document.getElementById("userGuess").value);

if (isNaN(guess)) {
alert("Please enter a valid number.");
return;
}

guessCount++;
guesses.push(guess);

if (guess === randomNumber) {
document.getElementById("feedback").innerText = "";
document.getElementById("guessList").innerText = "";
document.getElementById("winModal").classList.remove("hidden");
document.getElementById("winModal").classList.add("show"); // Show win modal
} else if (guess < randomNumber) {
document.getElementById("feedback").innerText = "📉 Too low!";
} else {
document.getElementById("feedback").innerText = "📈 Too high!";
}

document.getElementById("guessList").innerText = "Your guesses: " + guesses.join(", ");

// Check if max attempts reached
if (guessCount >= maxTries && guess !== randomNumber) {
document.getElementById("feedback").innerText = "";
document.getElementById("gameArea").classList.add("hidden");

// Show lose modal with the correct number
document.getElementById("correctNumber").innerText = randomNumber;
document.getElementById("loseModal").classList.remove("hidden"); // Ensure lose modal is shown
document.getElementById("loseModal").classList.add("show");
}

document.getElementById("userGuess").value = '';
}


function resetGame() {
// Hide the modals
document.getElementById("winModal").classList.remove("show");
document.getElementById("loseModal").classList.remove("show");

// Hide the game area and reset input field
document.getElementById("gameArea").classList.add("hidden");
document.getElementById("userGuess").value = '';

// Optionally reset the radio selections (ranges and attempts)
document.querySelectorAll('input[type=radio]').forEach(el => el.checked = false);

// Reset any other necessary game state (like guesses, feedback, etc.)
guesses = [];
document.getElementById("feedback").innerText = '';
document.getElementById("guessList").innerText = '';
}
