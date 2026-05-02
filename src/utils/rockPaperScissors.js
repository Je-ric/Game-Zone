export const CHOICES = ['rock', 'paper', 'scissors']

export const CHOICE_META = {
  rock:     { icon: 'fa-hand-rock',     bg: 'bg-gradient-to-br from-indigo-500 to-indigo-700' },
  paper:    { icon: 'fa-hand-paper',    bg: 'bg-gradient-to-br from-cyan-400 to-cyan-600' },
  scissors: { icon: 'fa-hand-scissors', bg: 'bg-gradient-to-br from-pink-500 to-pink-700' },
}

export function getComputerChoice() {
  return CHOICES[Math.floor(Math.random() * 3)]
}

export function determineWinner(player, computer) {
  if (player === computer) return 'tie'
  if (
    (player === 'rock'     && computer === 'scissors') ||
    (player === 'paper'    && computer === 'rock')     ||
    (player === 'scissors' && computer === 'paper')
  ) return 'player'
  return 'computer'
}
