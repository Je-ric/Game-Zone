let randomNumber;
let maxTries;
let maxRange;
let guessCount;
let guesses = [];

const correctSound = new Audio('audio/Win.mp3');
const wrongSound = new Audio('audio/Lose.mp3');

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

    // Update guesses left
    const remainingGuesses = maxTries - guessCount;
    document.getElementById("guessesLeft").innerText = `Guesses Left: ${remainingGuesses}`;

    if (guess === randomNumber) {
        document.getElementById("feedback").innerText = "";
        document.getElementById("guessList").innerText = "";
        document.getElementById("winModal").classList.remove("hidden");
        document.getElementById("winModal").classList.add("show"); 
        correctSound.play(); // Play correct sound
    } else if (guess < randomNumber) {
        document.getElementById("feedback").innerText = "📉 Too low!";
        wrongSound.play(); // Play wrong sound
    } else {
        document.getElementById("feedback").innerText = "📈 Too high!";
        wrongSound.play(); // Play wrong sound
    }

    document.getElementById("guessList").innerText = "Your guesses: " + guesses.join(", ");

    if (guessCount >= maxTries && guess !== randomNumber) {
        document.getElementById("feedback").innerText = "";
        document.getElementById("gameArea").classList.add("hidden");

        document.getElementById("correctNumber").innerText = randomNumber;
        document.getElementById("loseModal").classList.remove("hidden"); 
        document.getElementById("loseModal").classList.add("show");

        wrongSound.play(); // Play wrong sound when the game ends
    }

    document.getElementById("userGuess").value = '';
}

function checkEnter(event) {
    if (event.key === "Enter") {
        checkGuess();
    }
}

function resetGame() {
    document.getElementById("winModal").classList.remove("show");
    document.getElementById("loseModal").classList.remove("show");

    document.getElementById("gameArea").classList.add("hidden");
    document.getElementById("userGuess").value = '';
    document.querySelectorAll('input[type=radio]').forEach(el => el.checked = false);

    guesses = [];
    document.getElementById("feedback").innerText = '';
    document.getElementById("guessList").innerText = '';
}
