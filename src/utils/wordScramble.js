export function scrambleWord(word) {
  const arr = word.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.join('').toUpperCase()
}

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
