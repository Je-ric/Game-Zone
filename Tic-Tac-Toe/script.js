const gameBoard = document.getElementById('gameBoard');
    const resetButton = document.getElementById('resetButton');
    const resetScoreButton = document.getElementById('resetScoreButton');
    const turnIndicator = document.getElementById('turnIndicator');
    const scoreX = document.getElementById('scoreX');
    const scoreO = document.getElementById('scoreO');
    
    let board = Array(9).fill(null);
    let isXTurn = true;
    let xScore = 0;
    let oScore = 0;

    const winningCombinations = [
        [0,1,2], 
        [3,4,5], 
        [6,7,8],
        [0,3,6], 
        [1,4,7], 
        [2,5,8],
        [0,4,8], 
        [2,4,6]
    ];

    function initializeBoard() {
        gameBoard.innerHTML = '';
        board.fill(null);
        isXTurn = true;
        
        updateTurnIndicator();

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }

    function updateTurnIndicator() {
        turnIndicator.className = isXTurn ? 'turn-indicator x' : 'turn-indicator o';
        turnIndicator.innerHTML = `Current turn: <span>${isXTurn ? 'X' : 'O'}</span>`;
    }

    function handleCellClick(e) {
        const index = e.target.dataset.index;
        if (board[index]) return;

        const mark = isXTurn ? 'X' : 'O';
        board[index] = mark;
        e.target.textContent = mark;
        e.target.classList.add(mark);

        if (checkWinner(mark)) {
            highlightWinner(mark);
            disableBoard();
            updateScore(mark);
            turnIndicator.innerHTML = `<span>${mark}</span> wins!`;
            return;
        }
        
        // Check for draw
        if (board.every(cell => cell !== null)) {
            turnIndicator.innerHTML = `It's a draw!`;
            return;
        }

        isXTurn = !isXTurn;
        updateTurnIndicator();
    }

    function checkWinner(player) {
        return winningCombinations.some(combo => {
            return combo.every(index => board[index] === player);
        });
    }

    function highlightWinner(player) {
        winningCombinations.forEach(combo => {
            if (combo.every(index => board[index] === player)) {
            combo.forEach(index => {
                document.querySelector(`[data-index="${index}"]`).classList.add('winning');
            });
            }
        });
    }

    function disableBoard() {
        const allCells = document.querySelectorAll('.cell');
        allCells.forEach(cell => cell.removeEventListener('click', handleCellClick));
    }
    
    function updateScore(player) {
        if (player === 'X') {
            xScore++;
            scoreX.textContent = xScore;
        } else {
            oScore++;
            scoreO.textContent = oScore;
        }
    }
    
    function resetScore() {
        xScore = 0;
        oScore = 0;
        scoreX.textContent = '0';
        scoreO.textContent = '0';
    }

    resetButton.addEventListener('click', initializeBoard);
    resetScoreButton.addEventListener('click', resetScore);

    initializeBoard();