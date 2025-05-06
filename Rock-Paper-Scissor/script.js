// DOM Elements
const playerNameInput = document.getElementById('playerName');
const playerNameDisplay = document.getElementById('playerNameDisplay');
const editNameBtn = document.getElementById('editNameBtn');
const playerScore = document.getElementById('playerScore');
const computerScore = document.getElementById('computerScore');
const resultDisplay = document.getElementById('resultDisplay');
const playerChoiceDisplay = document.getElementById('playerChoiceDisplay');
const computerChoiceDisplay = document.getElementById('computerChoiceDisplay');
const rockBtn = document.getElementById('rockBtn');
const paperBtn = document.getElementById('paperBtn');
const scissorsBtn = document.getElementById('scissorsBtn');
const resetBtn = document.getElementById('resetBtn');
const gameHistory = document.getElementById('gameHistory');

// Game Variables
let playerScoreValue = 0;
let computerScoreValue = 0;

// Update player name when input changes
playerNameInput.addEventListener('change', function() {
    const newName = playerNameInput.value.trim() || 'Player 1';
    playerNameDisplay.textContent = newName;
});

// Toggle focus on name input when edit button is clicked
editNameBtn.addEventListener('click', function() {
    playerNameInput.focus();
});

// Game Logic Functions
function getComputerChoice() {
    // Generate a random number between 0 and 2
    const randomNumber = Math.floor(Math.random() * 3);
    
    // Map the random number to rock, paper, or scissors
    if (randomNumber === 0) return 'rock';
    if (randomNumber === 1) return 'paper';
    return 'scissors';
}

function determineWinner(playerChoice, computerChoice) {
    // If choices are the same, it's a tie
    if (playerChoice === computerChoice) {
        return 'tie';
    }
    
    // Check all winning conditions for the player
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'player';
    }
    
    // If not a tie and player didn't win, computer wins
    return 'computer';
}

function updateScore(winner) {
    if (winner === 'player') {
        playerScoreValue++;
        playerScore.textContent = playerScoreValue;
    } else if (winner === 'computer') {
        computerScoreValue++;
        computerScore.textContent = computerScoreValue;
    }
}

function displayResult(result, playerChoice, computerChoice) {
    // Update the choice displays
    playerChoiceDisplay.innerHTML = getChoiceIcon(playerChoice);
    computerChoiceDisplay.innerHTML = getChoiceIcon(computerChoice);
    
    // Update the result text
    let resultText = '';
    let resultClass = '';
    
    if (result === 'tie') {
        resultText = "It's a tie!";
        resultClass = 'text-yellow-600';
    } else if (result === 'player') {
        resultText = `${playerNameDisplay.textContent} wins!`;
        resultClass = 'text-green-600';
    } else {
        resultText = 'Computer wins!';
        resultClass = 'text-red-600';
    }
    
    resultDisplay.innerHTML = `<p class="text-xl font-bold ${resultClass} result-animation">${resultText}</p>`;
    
    // Add to game history
    addToHistory(playerChoice, computerChoice, result);
}

function getChoiceIcon(choice) {
    if (choice === 'rock') return '<i class="fas fa-hand-rock text-indigo-600"></i>';
    if (choice === 'paper') return '<i class="fas fa-hand-paper text-indigo-600"></i>';
    if (choice === 'scissors') return '<i class="fas fa-hand-scissors text-indigo-600"></i>';
    return '<i class="fas fa-question text-gray-400"></i>';
}

function addToHistory(playerChoice, computerChoice, result) {
    const historyItem = document.createElement('li');
    historyItem.className = 'history-item';
    
    // Add class based on result
    if (result === 'player') {
        historyItem.classList.add('history-win');
    } else if (result === 'computer') {
        historyItem.classList.add('history-loss');
    } else {
        historyItem.classList.add('history-tie');
    }
    
    let resultText = '';
    let resultClass = '';
    
    if (result === 'tie') {
        resultText = 'Tie';
        resultClass = 'result-tie';
    } else if (result === 'player') {
        resultText = 'Win';
        resultClass = 'result-win';
    } else {
        resultText = 'Loss';
        resultClass = 'result-loss';
    }
    
    historyItem.innerHTML = `
        <div class="history-choices">
            <span>${getChoiceIcon(playerChoice)}</span>
            <span>vs</span>
            <span>${getChoiceIcon(computerChoice)}</span>
        </div>
        <span class="history-result ${resultClass}">${resultText}</span>
    `;
    
    gameHistory.prepend(historyItem);
    
    // Limit history to 10 items
    if (gameHistory.children.length > 10) {
        gameHistory.removeChild(gameHistory.lastChild);
    }
}

function playGame(playerChoice) {
    // Get computer's choice
    const computerChoice = getComputerChoice();
    
    // Determine the winner
    const result = determineWinner(playerChoice, computerChoice);
    
    // Update the score
    updateScore(result);
    
    // Display the result
    displayResult(result, playerChoice, computerChoice);
}

// Event Listeners for Game Buttons
rockBtn.addEventListener('click', function() {
    playGame('rock');
});

paperBtn.addEventListener('click', function() {
    playGame('paper');
});

scissorsBtn.addEventListener('click', function() {
    playGame('scissors');
});

// Reset Game
resetBtn.addEventListener('click', function() {
    // Reset scores
    playerScoreValue = 0;
    computerScoreValue = 0;
    playerScore.textContent = '0';
    computerScore.textContent = '0';
    
    // Reset displays
    resultDisplay.innerHTML = '<p class="text-xl font-medium text-gray-700">Choose your weapon!</p>';
    playerChoiceDisplay.innerHTML = '<i class="fas fa-question"></i>';
    computerChoiceDisplay.innerHTML = '<i class="fas fa-question"></i>';
    
    // Clear history
    gameHistory.innerHTML = '';
});