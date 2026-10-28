const EMOJIS = [
  '🍎', '🚀', '🌈', '🎲', '🎧', '🌵', '🐳', '🍕', '⚽', '🐉',
  '🍩', '🔑', '🎁', '🌙', '🐙', '🍋', '🦋', '🎸', '🧊', '🔮',
  '🦩', '🐵', '🧩', '🪁', '☃️', '🍀',
]

export const EASY_PAIRS = 8   // 4x4 grid
export const HARD_PAIRS = 18  // 6x6 grid

export function createDeck(pairs) {
  const chosen = EMOJIS.slice(0, pairs)
  const deck = [...chosen, ...chosen].map((emoji, id) => ({ id, emoji }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
