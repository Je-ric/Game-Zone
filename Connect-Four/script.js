const ROWS = 6;
const COLS = 7;
let board = [];
let currentPlayer = 'red';
let gameOver = false;
let score = { red: 0, yellow: 0 };

const game = document.getElementById('game');
const statusEl = document.getElementById('status');
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');

function createBoard() {
  board = [];
  game.innerHTML = '';
  for (let row = 0; row < ROWS; row++) {
    const rowArr = [];
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', handleMove);
      game.appendChild(cell);
      rowArr.push(null);
    }
    board.push(rowArr);
  }
}

function handleMove(e) {
  if (gameOver) return;

  const col = parseInt(e.target.dataset.col);
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board[row][col]) {
      board[row][col] = currentPlayer;
      const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
      cell.classList.add(currentPlayer);
      if (checkWinner(row, col)) {
        gameOver = true;
        statusEl.textContent = `${getPlayerName(currentPlayer)} wins!`;
        updateScore();
        highlightWinner(row, col);
      } else if (isDraw()) {
        statusEl.textContent = `It's a draw!`;
      } else {
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
        statusEl.textContent = `${getPlayerName(currentPlayer)}'s turn (${capitalize(currentPlayer)})`;
        toggleActivePanel();
      }
      break;
    }
  }
}

function checkWinner(r, c) {
  const directions = [[0,1], [1,0], [1,1], [1,-1]];
  for (let [dr, dc] of directions) {
    let count = 1;
    count += countDirection(r, c, dr, dc);
    count += countDirection(r, c, -dr, -dc);
    if (count >= 4) return true;
  }
  return false;
}

function countDirection(r, c, dr, dc) {
  let count = 0;
  let color = board[r][c];
  r += dr;
  c += dc;
  while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === color) {
    count++;
    r += dr;
    c += dc;
  }
  return count;
}

function isDraw() {
  return board.every(row => row.every(cell => cell));
}

function highlightWinner(r, c) {
  const color = board[r][c];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const line = [[r, c]];
      for (let step = 1; step < 4; step++) {
        const nr = r + dr * step;
        const nc = c + dc * step;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== color) break;
        line.push([nr, nc]);
      }
      for (let step = 1; step < 4; step++) {
        const nr = r - dr * step;
        const nc = c - dc * step;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== color) break;
        line.push([nr, nc]);
      }
      if (line.length >= 4) {
        line.forEach(([row, col]) => {
          const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
          cell.classList.add('winner');
        });
        return;
      }
    }
  }
}

function updateScore() {
  score[currentPlayer]++;
  score1.textContent = score.red;
  score2.textContent = score.yellow;
}

function toggleActivePanel() {
  player1.classList.toggle('active', currentPlayer === 'red');
  player2.classList.toggle('active', currentPlayer === 'yellow');
}

function getPlayerName(color) {
  return color === 'red' ? 'Player 1' : 'Player 2';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

document.getElementById('newRoundBtn').addEventListener('click', () => {
  currentPlayer = 'red';
  gameOver = false;
  statusEl.textContent = `Player 1's turn (Red)`;
  toggleActivePanel();
  createBoard();
});

document.getElementById('newGameBtn').addEventListener('click', () => {
  score = { red: 0, yellow: 0 };
  score1.textContent = 0;
  score2.textContent = 0;
  currentPlayer = 'red';
  gameOver = false;
  statusEl.textContent = `Player 1's turn (Red)`;
  toggleActivePanel();
  createBoard();
});

createBoard();