export const ROWS = 6
export const COLS = 5

const ANSWERS = [
  'about', 'above', 'actor', 'acute', 'admit', 'adopt', 'after', 'again', 'agent', 'agree',
  'ahead', 'alarm', 'album', 'alert', 'alive', 'allow', 'alone', 'along', 'alter', 'among',
  'anger', 'angle', 'angry', 'apart', 'apple', 'apply', 'arena', 'argue', 'arise', 'aside',
  'asset', 'audio', 'audit', 'avoid', 'awake', 'award', 'aware', 'badge', 'basic', 'basis',
  'beach', 'began', 'begin', 'being', 'below', 'bench', 'birth', 'black', 'blame', 'blind',
  'block', 'blood', 'board', 'brain', 'brand', 'bread', 'break', 'breed', 'bring', 'broad',
  'broke', 'brown', 'build', 'built', 'buyer', 'cable', 'carry', 'catch', 'cause', 'chain',
  'chair', 'chart', 'chase', 'cheap', 'check', 'chest', 'chief', 'child', 'choir', 'choose',
  'chunk', 'civil', 'claim', 'class', 'clean', 'clear', 'click', 'cliff', 'climb', 'clock',
  'close', 'cloth', 'cloud', 'coach', 'coast', 'could', 'count', 'court', 'cover', 'craft',
  'crash', 'cream', 'crime', 'cross', 'crowd', 'crown', 'curve', 'cycle', 'daily', 'dance',
  'depth', 'doubt', 'draft', 'drama', 'dream', 'dress', 'drink', 'drive', 'eager', 'early',
  'earth', 'eight', 'elite', 'empty', 'enemy', 'enjoy', 'enter', 'entry', 'equal', 'error',
  'event', 'every', 'exact', 'exist', 'extra', 'faith', 'false', 'fancy', 'fault', 'fiber',
  'field', 'fifth', 'fifty', 'fight', 'final', 'first', 'flame', 'flash', 'fleet', 'floor',
  'fluid', 'focus', 'force', 'forge', 'frame', 'fresh', 'front', 'fruit', 'fully', 'funny',
  'giant', 'given', 'glass', 'globe', 'going', 'grace', 'grade', 'grain', 'grand', 'grant',
  'grass', 'great', 'green', 'greet', 'gross', 'group', 'grown', 'guard', 'guess', 'guest',
  'guide', 'happy', 'heart', 'heavy', 'honey', 'horse', 'hotel', 'house', 'human', 'ideal',
  'image', 'imply', 'index', 'inner', 'input', 'issue', 'joint', 'judge', 'juice', 'known',
  'label', 'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'least', 'leave', 'legal',
  'lemon', 'light', 'limit', 'linen', 'liver', 'local', 'loose', 'lower', 'lucky', 'lunch',
  'magic', 'major', 'maker', 'march', 'match', 'maybe', 'mayor', 'metal', 'meter', 'might',
  'minor', 'model', 'money', 'month', 'moral', 'motor', 'mount', 'mouse', 'mouth', 'movie',
  'music', 'never', 'night', 'noise', 'north', 'novel', 'nurse', 'occur', 'ocean', 'offer',
  'often', 'olive', 'onion', 'opera', 'orbit', 'organ', 'other', 'ought', 'outer', 'owner',
  'paint', 'panel', 'paper', 'party', 'peace', 'phase', 'phone', 'photo', 'piano', 'piece',
  'pilot', 'pitch', 'place', 'plain', 'plane', 'plant', 'plate', 'point', 'pound', 'power',
  'press', 'price', 'pride', 'prime', 'print', 'prior', 'prize', 'proof', 'proud', 'prove',
  'queen', 'quick', 'quiet', 'quite', 'radio', 'raise', 'range', 'rapid', 'ratio', 'reach',
  'ready', 'refer', 'right', 'river', 'rough', 'round', 'route', 'royal', 'scale', 'scene',
  'scope', 'score', 'sense', 'serve', 'seven', 'shall', 'shape', 'share', 'sharp', 'sheet',
  'shelf', 'shell', 'shift', 'shine', 'shirt', 'shock', 'shoot', 'short', 'shown', 'sight',
  'skill', 'sleep', 'small', 'smart', 'smile', 'smoke', 'solid', 'solve', 'sorry', 'sound',
  'south', 'space', 'spare', 'speak', 'speed', 'spend', 'spent', 'split', 'spoke', 'sport',
  'staff', 'stage', 'stake', 'stand', 'start', 'state', 'steam', 'steel', 'stick', 'still',
  'stock', 'stone', 'stood', 'store', 'storm', 'story', 'strip', 'stuck', 'study', 'stuff',
  'style', 'sugar', 'sweet', 'table', 'taste', 'teach', 'thank', 'their', 'theme', 'there',
  'these', 'thick', 'thing', 'think', 'third', 'those', 'three', 'threw', 'throw', 'tight',
  'tired', 'title', 'today', 'total', 'touch', 'tough', 'tower', 'track', 'trade', 'train',
  'trend', 'trial', 'trust', 'truth', 'twice', 'under', 'union', 'until', 'upper', 'urban',
  'usage', 'usual', 'valid', 'value', 'video', 'virus', 'visit', 'vital', 'voice', 'waste',
  'watch', 'water', 'wheel', 'where', 'which', 'while', 'white', 'whole', 'whose', 'woman',
  'world', 'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'write', 'wrong', 'wrote',
  'yield', 'young',
]

export function pickAnswer(previous = '') {
  let word = previous
  while (word === previous) {
    word = ANSWERS[Math.floor(Math.random() * ANSWERS.length)]
  }
  return word
}

export function isValidGuess(guess) {
  return /^[a-z]{5}$/i.test(guess)
}

// Returns an array of 'correct' | 'present' | 'absent' — standard Wordle rules,
// where a letter marked 'correct' is consumed before 'present' is considered.
export function gradeGuess(guess, answer) {
  const g = guess.toLowerCase().split('')
  const a = answer.toLowerCase().split('')
  const result = Array(COLS).fill('absent')
  const used = Array(COLS).fill(false)

  for (let i = 0; i < COLS; i++) {
    if (g[i] === a[i]) {
      result[i] = 'correct'
      used[i] = true
    }
  }
  for (let i = 0; i < COLS; i++) {
    if (result[i] === 'correct') continue
    for (let j = 0; j < COLS; j++) {
      if (!used[j] && g[i] === a[j]) {
        result[i] = 'present'
        used[j] = true
        break
      }
    }
  }
  return result
}

export const KEY_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Back'],
]

const RANK = { absent: 1, present: 2, correct: 3 }

// Merge a new grading into the keyboard letter states (never downgrades).
export function mergeKeyStates(states, guess, grades) {
  guess.toLowerCase().split('').forEach((letter, i) => {
    const next = grades[i]
    if (!states[letter] || RANK[next] > RANK[states[letter]]) {
      states[letter] = next
    }
  })
}
