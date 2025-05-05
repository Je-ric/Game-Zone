const ROWS = 6;
const COLUMNS = 7;
let currentPlayer = 'red';
let board = [];
let gameOver = false;

const gameElement = document.getElementById('game');
const statusElement = document.getElementById('status');

function startGame() {
  board = [];
  gameElement.innerHTML = '';
  gameOver = false;
  currentPlayer = 'red';
  statusElement.textContent = "Player Red's Turn";

  for (let row = 0; row < ROWS; row++) {
    board[row] = [];
    for (let col = 0; col < COLUMNS; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      gameElement.appendChild(cell);
      board[row][col] = '';
    }
  }
}

gameElement.addEventListener('click', function (event) {
  if (gameOver || !event.target.classList.contains('cell')) return;

  const col = parseInt(event.target.dataset.col);
  let placedRow = -1;

  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === '') {
      board[row][col] = currentPlayer;
      placedRow = row;
      break;
    }
  }

  if (placedRow === -1) return;

  const cell = document.querySelector(`.cell[data-row="${placedRow}"][data-col="${col}"]`);
  cell.classList.add(currentPlayer);

  const winCells = checkWinner(placedRow, col);
  if (winCells) {
    winCells.forEach(([r, c]) => {
      const winCell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
      winCell.classList.add('winner');
    });
    statusElement.textContent = `🎉 Player ${capitalize(currentPlayer)} Wins!`;
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
  statusElement.textContent = `Player ${capitalize(currentPlayer)}'s Turn`;
});

function checkWinner(row, col) {
  const directions = [
    { r: 0, c: 1 },
    { r: 1, c: 0 },
    { r: 1, c: 1 },
    { r: 1, c: -1 }
  ];

  for (let dir of directions) {
    const line = [[row, col]];

    line.push(...collectLine(row, col, dir.r, dir.c));
    line.push(...collectLine(row, col, -dir.r, -dir.c));

    if (line.length >= 4) {
      return line;
    }
  }

  return null;
}

function collectLine(row, col, rowStep, colStep) {
  const cells = [];
  let r = row + rowStep;
  let c = col + colStep;

  while (
    r >= 0 && r < ROWS &&
    c >= 0 && c < COLUMNS &&
    board[r][c] === currentPlayer
  ) {
    cells.push([r, c]);
    r += rowStep;
    c += colStep;
  }

  return cells;
}

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}

startGame();