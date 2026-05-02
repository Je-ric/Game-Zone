# GameZone

A collection of interactive browser games built with Vue 3 and Tailwind CSS. All games run entirely in the browser with no backend required.

---

## Games

| # | Game | Description |
|---|------|-------------|
| 01 | Word Scramble | Unscramble the letters to form the correct word before time runs out |
| 02 | Coin Flip | Two-player coin flip with single or double coin modes, first to 5 wins |
| 03 | Color Match | Match the displayed RGB/HEX color by clicking the correct color swatch |
| 04 | Connect Four | Drop pieces and get four in a row — classic two-player strategy game |
| 05 | Emoji Catcher | Click the active emoji tile as fast as you can before the timer runs out |
| 06 | Guess the Number | Guess the secret number within a limited number of attempts |
| 07 | Rock Paper Scissors | Play against the computer with score tracking and game history |
| 08 | Tic Tac Toe | Classic Xs and Os with score tracking across rounds |

---

## Tech Stack

- **Vue 3** — Composition API with `<script setup>`
- **Vite** — build tool and dev server
- **Tailwind CSS** — via CDN
- **Vue Router** — hash-based client-side routing
- **Boxicons / Font Awesome** — icon sets via CDN

---

## Project Structure

```
src/
├── components/
│   ├── layouts/        # GameLayout — back button + title wrapper
│   ├── games/          # GameCard — home grid card
│   └── ui/             # AppBtn, BentoCard, CardHeader, StatTile, GameModal, RadioGroup
├── composables/        # useGameTimer, useModal, useScore
├── data/               # games.js — game registry and route definitions
├── router/             # index.js — vue-router setup
├── utils/              # per-game logic (coinFlip, colorMatch, connectFour, etc.)
└── views/              # one .vue file per game
public/
├── emoji/              # emoji images for Emoji Catcher
├── audio/              # win/lose sounds for Guess the Number
└── words.json          # word list for Word Scramble
```

---

## Getting Started

**Requirements:** Node.js 18+

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```
