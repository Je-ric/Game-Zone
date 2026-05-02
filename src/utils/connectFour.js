export const ROWS = 6
export const COLS = 7

export function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

export function dropPiece(board, col, player) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board[row][col]) {
      board[row][col] = player
      return row
    }
  }
  return -1
}

export function checkWinner(board, r, c) {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]]
  for (const [dr, dc] of dirs) {
    if (countDir(board, r, c, dr, dc) + countDir(board, r, c, -dr, -dc) + 1 >= 4) return true
  }
  return false
}

export function getWinCells(board, r, c) {
  const color = board[r][c]
  const dirs = [[0,1],[1,0],[1,1],[1,-1]]
  for (const [dr, dc] of dirs) {
    const line = [[r, c]]
    for (let s = 1; s < 4; s++) {
      const nr = r + dr * s, nc = c + dc * s
      if (!inBounds(nr, nc) || board[nr][nc] !== color) break
      line.push([nr, nc])
    }
    for (let s = 1; s < 4; s++) {
      const nr = r - dr * s, nc = c - dc * s
      if (!inBounds(nr, nc) || board[nr][nc] !== color) break
      line.push([nr, nc])
    }
    if (line.length >= 4) return new Set(line.map(([row, col]) => row * COLS + col))
  }
  return new Set()
}

export function isBoardFull(board) {
  return board.every(row => row.every(c => c))
}

function countDir(board, r, c, dr, dc) {
  let count = 0, color = board[r][c]
  r += dr; c += dc
  while (inBounds(r, c) && board[r][c] === color) { count++; r += dr; c += dc }
  return count
}

function inBounds(r, c) { return r >= 0 && r < ROWS && c >= 0 && c < COLS }
