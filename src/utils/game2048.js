export const SIZE = 4

export function createBoard() {
  const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
  spawn(board)
  spawn(board)
  return board
}

export function spawn(board) {
  const empty = []
  board.forEach((row, r) => row.forEach((v, c) => { if (!v) empty.push([r, c]) }))
  if (!empty.length) return false
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]
  board[r][c] = Math.random() < 0.9 ? 2 : 4
  return true
}

function slideLeft(line) {
  const arr = line.filter(v => v)
  const out = []
  let gained = 0
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr[i + 1]) {
      out.push(arr[i] * 2)
      gained += arr[i] * 2
      i++
    } else {
      out.push(arr[i])
    }
  }
  while (out.length < SIZE) out.push(0)
  return { out, gained }
}

// dir: 'left' | 'right' | 'up' | 'down'
export function move(board, dir) {
  const next = Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
  let gained = 0

  for (let i = 0; i < SIZE; i++) {
    const line = []
    for (let j = 0; j < SIZE; j++) {
      if (dir === 'left')       line.push(board[i][j])
      else if (dir === 'right') line.push(board[i][SIZE - 1 - j])
      else if (dir === 'up')    line.push(board[j][i])
      else                      line.push(board[SIZE - 1 - j][i])
    }
    const { out, gained: g } = slideLeft(line)
    gained += g
    for (let j = 0; j < SIZE; j++) {
      if (dir === 'left')       next[i][j] = out[j]
      else if (dir === 'right') next[i][j] = out[SIZE - 1 - j]
      else if (dir === 'up')    next[j][i] = out[j]
      else                      next[SIZE - 1 - j][i] = out[j]
    }
  }

  const moved = JSON.stringify(next) !== JSON.stringify(board)
  return { board: next, gained, moved }
}

export function canMove(board) {
  if (board.some(row => row.some(v => !v))) return true
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = board[r][c]
      if (c + 1 < SIZE && board[r][c + 1] === v) return true
      if (r + 1 < SIZE && board[r + 1][c] === v) return true
    }
  }
  return false
}

export function hasTarget(board) {
  return board.some(row => row.some(v => v >= 2048))
}

export function tileStyle(value) {
  const palette = {
    2:    { bg: '#eee4da', fg: '#776e65' },
    4:    { bg: '#ede0c8', fg: '#776e65' },
    8:    { bg: '#f2b179', fg: '#f9f6f2' },
    16:   { bg: '#f59563', fg: '#f9f6f2' },
    32:   { bg: '#f67c5f', fg: '#f9f6f2' },
    64:   { bg: '#f65e3b', fg: '#f9f6f2' },
    128:  { bg: '#edcf72', fg: '#f9f6f2' },
    256:  { bg: '#edcc61', fg: '#f9f6f2' },
    512:  { bg: '#edc850', fg: '#f9f6f2' },
    1024: { bg: '#edc53f', fg: '#f9f6f2' },
    2048: { bg: '#edc22e', fg: '#f9f6f2' },
  }
  const { bg, fg } = palette[value] || { bg: '#3c3a32', fg: '#f9f6f2' }
  return { background: bg, color: fg }
}
