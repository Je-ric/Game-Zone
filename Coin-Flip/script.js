// Game variables
let gameMode = '';
let players = [
    { name: 'Player 1', score: 0, bet: '' },
    { name: 'Player 2', score: 0, bet: '' }
];
const targetScore = 5;
let isFlipping = false;

// Select game mode
function selectMode(mode) {
    gameMode = mode;
    
    // Update UI
    document.querySelectorAll('.mode-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`.mode-card[data-mode="${mode}"]`).classList.add('selected');
    
    // Enable start button
    document.getElementById('startGameBtn').disabled = false;
}

// Start the game
function startGame() {
    // Update player names
    players[0].name = document.getElementById('player1Name').value || 'Player 1';
    players[1].name = document.getElementById('player2Name').value || 'Player 2';
    
    // Show game section, hide setup
    document.getElementById('setup').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    
    // Update mode display
    const modeText = gameMode === 'single' ? 'Single Coin Mode' : 'Double Coin Mode';
    document.getElementById('currentMode').textContent = modeText;
    
    // Generate betting options based on game mode
    generateBettingOptions();
    
    // Update player name inputs
    document.getElementById('player1Name').value = players[0].name;
    document.getElementById('player2Name').value = players[1].name;
    
    // Reset scores
    players[0].score = 0;
    players[1].score = 0;
    updateScoreDisplay();
    
    // Clear result message
    document.getElementById('resultMessage').textContent = '';
    document.getElementById('resultDetails').textContent = '';
    
    // Create coin(s)
    createCoins();
}

// Generate betting options based on game mode
function generateBettingOptions() {
    const player1Options = document.getElementById('player1Options');
    const player2Options = document.getElementById('player2Options');
    
    player1Options.innerHTML = '';
    player2Options.innerHTML = '';
    
    if (gameMode === 'single') {
        // Single coin options
        const options = [
        { value: 'heads', label: 'Heads', icon: '👑' },
        { value: 'tails', label: 'Tails', icon: '⚜️' }
        ];
        
        options.forEach((option, index) => {
        player1Options.innerHTML += `
            <div class="bet-option">
            <input type="radio" name="player1Bet" id="p1-${option.value}" value="${option.value}" ${index === 0 ? 'checked' : ''}>
            <label for="p1-${option.value}">
                <span class="bet-icon">${option.icon}</span>
                ${option.label}
            </label>
            </div>
        `;
        
        player2Options.innerHTML += `
            <div class="bet-option">
            <input type="radio" name="player2Bet" id="p2-${option.value}" value="${option.value}" ${index === 1 ? 'checked' : ''}>
            <label for="p2-${option.value}">
                <span class="bet-icon">${option.icon}</span>
                ${option.label}
            </label>
            </div>
        `;
        });
    } else {
        // Double coin options
        const options = [
        { value: 'both-heads', label: 'Both Heads', icon: '👑👑' },
        { value: 'both-tails', label: 'Both Tails', icon: '⚜️⚜️' },
        { value: 'mixed', label: 'One of Each', icon: '👑⚜️' }
        ];
        
        options.forEach((option, index) => {
        player1Options.innerHTML += `
            <div class="bet-option">
            <input type="radio" name="player1Bet" id="p1-${option.value}" value="${option.value}" ${index === 0 ? 'checked' : ''}>
            <label for="p1-${option.value}">
                <span class="bet-icon">${option.icon}</span>
                ${option.label}
            </label>
            </div>
        `;
        
        player2Options.innerHTML += `
            <div class="bet-option">
            <input type="radio" name="player2Bet" id="p2-${option.value}" value="${option.value}" ${index === 1 ? 'checked' : ''}>
            <label for="p2-${option.value}">
                <span class="bet-icon">${option.icon}</span>
                ${option.label}
            </label>
            </div>
        `;
        });
    }
}

// Create coins based on game mode
function createCoins() {
    const coinContainer = document.getElementById('coinContainer');
    coinContainer.innerHTML = '';
    
    const numCoins = gameMode === 'single' ? 1 : 2;
    
    for (let i = 0; i < numCoins; i++) {
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.id = `coin${i}`;
        
        coin.innerHTML = `
        <div class="coin-side heads">👑</div>
        <div class="coin-side tails">⚜️</div>
        `;
        
        coinContainer.appendChild(coin);
    }
}

// Flip the coins
function flipCoins() {
    if (isFlipping) return;
    
    // Get player bets
    players[0].bet = document.querySelector('input[name="player1Bet"]:checked').value;
    players[1].bet = document.querySelector('input[name="player2Bet"]:checked').value;
    
    // Clear previous results
    document.getElementById('resultMessage').textContent = 'Flipping...';
    document.getElementById('resultDetails').textContent = '';
    
    // Disable flip button during animation
    isFlipping = true;
    document.getElementById('flipBtn').disabled = true;
    
    // Get coin elements
    const coins = document.querySelectorAll('.coin');
    const results = [];
    
    // Reset all coins first to ensure animation plays every time
    coins.forEach(coin => {
        coin.className = 'coin';
    });
    
    // Force reflow to ensure animation restarts
    void document.getElementById('coinContainer').offsetWidth;
    
  // Flip each coin simultaneously
    setTimeout(() => {
        coins.forEach((coin, index) => {
        // Determine result (50/50 chance)
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        results.push(result);
        
        // Add flip animation
        coin.classList.add(result === 'heads' ? 'flip' : 'flip-tails');
        });
        
        // Check results after animation completes
        setTimeout(() => {
        checkResults(results);
        isFlipping = false;
        document.getElementById('flipBtn').disabled = false;
        }, 1600);
    }, 50);
}

// Check results and update scores
function checkResults(results) {
    let resultText = '';
    let detailsText = '';
    
    // Determine the outcome
    let outcome = '';
    
    if (gameMode === 'single') {
        outcome = results[0]; // 'heads' or 'tails'
        detailsText = `The coin landed on ${outcome.charAt(0).toUpperCase() + outcome.slice(1)}!`;
    } else {
        if (results[0] === 'heads' && results[1] === 'heads') {
        outcome = 'both-heads';
        detailsText = 'Both coins landed on Heads!';
        } else if (results[0] === 'tails' && results[1] === 'tails') {
        outcome = 'both-tails';
        detailsText = 'Both coins landed on Tails!';
        } else {
        outcome = 'mixed';
        detailsText = 'The coins landed on one Heads and one Tails!';
        }
    }
    
    // Check which players guessed correctly
    let player1Correct = players[0].bet === outcome;
    let player2Correct = players[1].bet === outcome;
    
    // Update scores
    if (player1Correct) players[0].score++;
    if (player2Correct) players[1].score++;
    
    // Create result message
    if (player1Correct && player2Correct) {
        resultText = 'Both players guessed correctly!';
    } else if (player1Correct) {
        resultText = `${players[0].name} guessed correctly!`;
    } else if (player2Correct) {
        resultText = `${players[1].name} guessed correctly!`;
    } else {
        resultText = 'No one guessed correctly!';
    }
    
    // Update UI
    document.getElementById('resultMessage').textContent = resultText;
    document.getElementById('resultDetails').textContent = detailsText;
    updateScoreDisplay();
    
    // Check for winner
    checkForWinner();
}

// Update score display
function updateScoreDisplay() {
    document.getElementById('player1Score').textContent = players[0].score;
    document.getElementById('player2Score').textContent = players[1].score;
}

// Check if there's a winner
function checkForWinner() {
    const player1Card = document.querySelector('.player-card:nth-child(1)');
    const player2Card = document.querySelector('.player-card:nth-child(2)');
    
    // Remove previous winner class
    player1Card.classList.remove('winner');
    player2Card.classList.remove('winner');
    
    if (players[0].score >= targetScore) {
        document.getElementById('resultMessage').textContent = `${players[0].name} wins the game!`;
        player1Card.classList.add('winner');
        document.getElementById('flipBtn').disabled = true;
    } else if (players[1].score >= targetScore) {
        document.getElementById('resultMessage').textContent = `${players[1].name} wins the game!`;
        player2Card.classList.add('winner');
        document.getElementById('flipBtn').disabled = true;
    }
}

// Reset the game
function resetGame() {
    document.getElementById('setup').style.display = 'block';
    document.getElementById('game').style.display = 'none';
    document.getElementById('flipBtn').disabled = false;
    
    // Reset mode selection
    document.querySelectorAll('.mode-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    gameMode = '';
    document.getElementById('startGameBtn').disabled = true;
    
  // Reset player data
    players = [
        { name: 'Player 1', score: 0, bet: '' },
        { name: 'Player 2', score: 0, bet: '' }
    ];
}

// Update player name when input changes
document.getElementById('player1Name').addEventListener('change', function() {
    players[0].name = this.value || 'Player 1';
});

document.getElementById('player2Name').addEventListener('change', function() {
    players[1].name = this.value || 'Player 2';
});