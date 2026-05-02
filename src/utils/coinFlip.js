export const COIN_MODES = [
  { value: 'single', label: 'Single Coin', icon: '🪙', desc: 'Classic heads or tails. Simple and fun!' },
  { value: 'double', label: 'Double Coin', icon: '🪙🪙', desc: 'Bet on two heads, two tails, or one of each!' },
]

export const BET_OPTIONS = {
  single: [
    { value: 'heads', label: 'Heads', icon: '👑' },
    { value: 'tails', label: 'Tails', icon: '⚜️' },
  ],
  double: [
    { value: 'both-heads', label: 'Both Heads', icon: '👑👑' },
    { value: 'both-tails', label: 'Both Tails', icon: '⚜️⚜️' },
    { value: 'mixed',      label: 'One of Each', icon: '👑⚜️' },
  ],
}

export function flipCoin() {
  return Math.random() < 0.5 ? 'heads' : 'tails'
}

export function resolveOutcome(results) {
  if (results.length === 1) return { outcome: results[0], detail: `The coin landed on ${cap(results[0])}!` }
  if (results[0] === 'heads' && results[1] === 'heads') return { outcome: 'both-heads', detail: 'Both coins landed on Heads!' }
  if (results[0] === 'tails' && results[1] === 'tails') return { outcome: 'both-tails', detail: 'Both coins landed on Tails!' }
  return { outcome: 'mixed', detail: 'One Heads and one Tails!' }
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1) }
