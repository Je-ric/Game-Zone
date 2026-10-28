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
| 09 | Memory Match | Flip cards and find all the emoji pairs in the fewest moves |
| 10 | 2048 | Slide and join the tiles to reach 2048 — keyboard, swipe or on-screen arrows |
| 11 | Word Guess | Crack the hidden 5-letter word in six tries with green/yellow/gray hints |

---

## Tech Stack

- **Vue 3** — Composition API with `<script setup>`
- **Vite** — build tool and dev server
- **Tailwind CSS** — compiled locally with PostCSS
- **Vue Router** — hash-based client-side routing
- **Boxicons / Font Awesome** — bundled icon sets

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

## Progressive Web App (PWA)

Install GameZone from the browser installation menu or the **Install app** button when supported. On iPhone/iPad, use Safari’s Share menu and **Add to Home Screen**. Production hosting requires HTTPS; localhost works for testing.

After the first successful online visit, wait for **This app is ready to use offline**. The production service worker caches all built routes, styles, fonts, icons, and local data assets, including routes you have not opened yet. A first visit still requires a connection.

The word list and emoji images are cached with all game routes. Switching apps or locking the screen can suspend timers; installation does not add background gameplay or session recovery.

Updates display **Reload to update** and **Later**. Finish any work or game before reloading; no update forces a reload. Ordinary reloads or closing the app can still discard unsaved in-memory state.

### Files used (source of truth)

- `vite.config.js`: manifest, precache, and cache policy.
- `src/components/PwaStatus.vue` and `src/App.vue`: installation, offline status, and update prompt.
- `src/main.js`, `src/style.css`, `tailwind.config.js`, and `postcss.config.js`: bundled interface assets and compiled CSS.
- `public/pwa-*.png` and `public/apple-touch-icon.png`: installation icons.

### Build and verify

1. Run `npm install`, then `npm run build` and `npm run preview`. The development server intentionally does not register a service worker.
2. Open the preview URL online and wait for offline readiness.
3. Switch browser networking offline, reload, and open routes you have not visited.
4. Reconnect, publish a changed build, and reopen the app to verify the update prompt. Choose **Later** to keep working or **Reload to update** when ready.

Deploy the complete `dist/` directory, including `sw.js`, its Workbox file, the manifest, and all assets. Serve `sw.js` and `index.html` with revalidation (for example, `Cache-Control: no-cache`); hashed assets may use immutable caching. Each app needs its own origin or a nonoverlapping deployment path and service-worker scope. The current configuration targets an origin root; configure Vite’s `base` and root-relative asset URLs before deploying under a subdirectory.
