<template>
  <GameLayout title="Memory Match" subtitle="Flip cards and find all the matching pairs!">
    <template #howtoplay>
      <ol class="list-decimal list-inside space-y-2">
        <li>Pick a difficulty and click <strong>Start Game</strong> to deal the cards face down.</li>
        <li>Click a card to <strong>flip it over</strong>, then click a second card to try for a match.</li>
        <li>If the two emojis match, they stay face up. If not, both flip back after a moment.</li>
        <li>Find all pairs in as <strong>few moves</strong> and as <strong>fast</strong> as you can.</li>
        <li>Your best moves and time are saved per difficulty on this device.</li>
      </ol>
    </template>

    <div class="w-full flex justify-center">
      <div class="w-full max-w-3xl flex flex-col gap-5">

        <!-- Start screen -->
        <template v-if="!gameStarted">
          <BentoCard cls="items-center text-center">
            <div class="text-6xl mb-2">🃏</div>
            <h2 class="text-2xl font-bold text-gray-800">Memory Match</h2>
            <p class="text-gray-400 text-sm max-w-xs">
              Flip the cards and find every matching emoji pair!
            </p>
            <div class="w-full max-w-xs flex gap-3">
              <button @click="difficulty = 'easy'"
                :class="`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all ${difficulty === 'easy' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`">
                🟢 Easy<br><span class="text-xs font-medium">4 × 4 · 8 pairs</span>
              </button>
              <button @click="difficulty = 'hard'"
                :class="`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all ${difficulty === 'hard' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`">
                🔴 Hard<br><span class="text-xs font-medium">6 × 6 · 18 pairs</span>
              </button>
            </div>
            <AppBtn icon="bx-play" cls="px-10 self-center" @click="startGame">
              Start Game
            </AppBtn>
          </BentoCard>
        </template>

        <!-- Game screen -->
        <template v-else>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <BentoCard>
              <CardHeader icon="bx-time" icon-color="text-rose-500">Time</CardHeader>
              <StatTile :value="formatTime(elapsed)" label="elapsed" value-color="text-rose-500" />
            </BentoCard>
            <BentoCard>
              <CardHeader icon="bx-move" icon-color="text-amber-500">Moves</CardHeader>
              <StatTile :value="moves" label="moves made" value-color="text-amber-500" />
            </BentoCard>
            <BentoCard>
              <CardHeader icon="bx-check-circle" icon-color="text-emerald-500">Pairs</CardHeader>
              <StatTile :value="`${matchedIds.length / 2}/${deck.length / 2}`" label="found" value-color="text-emerald-500" />
            </BentoCard>
            <BentoCard>
              <CardHeader icon="bx-trophy" icon-color="text-indigo-500">Best</CardHeader>
              <StatTile :value="best ? best.moves : '—'" label="best moves" value-color="text-indigo-500" />
            </BentoCard>
          </div>

          <BentoCard cls="items-center">
            <div class="w-full flex justify-center">
              <div class="grid gap-2 w-full" :style="{ maxWidth: gridWidth, gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }">
                <div v-for="card in deck" :key="card.id" class="memory-card" @click="flipCard(card)">
                  <div :class="['memory-card-inner', isFaceUp(card) ? 'is-flipped' : '']">
                    <div class="memory-card-face memory-card-back">❓</div>
                    <div class="memory-card-face memory-card-front"
                      :class="isMatched(card) ? 'matched' : ''">{{ card.emoji }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex gap-3">
              <AppBtn icon="bx-refresh" @click="startGame">New Game</AppBtn>
              <AppBtn icon="bx-reset" variant="secondary" @click="exitGame">Change Difficulty</AppBtn>
            </div>
          </BentoCard>
        </template>

      </div>
    </div>

    <GameModal :visible="won" :emoji="'🏆'" :title="'You win!'"
      :message="`Found all ${deck.length / 2} pairs in ${moves} moves and ${formatTime(elapsed)}.`"
      accent-class="bg-gradient-to-r from-emerald-500 to-green-500">
      <AppBtn icon="bx-refresh" cls="self-center" @click="startGame">Play Again</AppBtn>
    </GameModal>
  </GameLayout>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import GameLayout from '../components/layouts/GameLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import StatTile   from '../components/ui/StatTile.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import GameModal  from '../components/ui/GameModal.vue'
import { useScore } from '../composables/useScore.js'
import { createDeck, EASY_PAIRS, HARD_PAIRS, formatTime } from '../utils/memoryMatch.js'

const gameStarted = ref(false)
const difficulty  = ref('easy')
const deck        = ref([])
const flipped     = ref([])
const matchedIds  = ref([])
const moves       = ref(0)
const elapsed     = ref(0)
const won         = ref(false)
const lock        = ref(false)
const best        = ref(null)
let interval = null
let flipTimeout = null

const { increment } = useScore(['wins'])

const cols = computed(() => difficulty.value === 'easy' ? 4 : 6)
const gridWidth = computed(() => difficulty.value === 'easy' ? '340px' : '460px')

function bestKey() { return `gamezone-memory-best-${difficulty.value}` }

function loadBest() {
  try { best.value = JSON.parse(localStorage.getItem(bestKey())) } catch { best.value = null }
}

function saveBest() {
  const current = { moves: moves.value, time: elapsed.value }
  if (!best.value || current.moves < best.value.moves) {
    best.value = current
    localStorage.setItem(bestKey(), JSON.stringify(current))
  }
}

function startGame() {
  const pairs = difficulty.value === 'easy' ? EASY_PAIRS : HARD_PAIRS
  deck.value = createDeck(pairs)
  flipped.value = []
  matchedIds.value = []
  moves.value = 0
  elapsed.value = 0
  won.value = false
  lock.value = false
  gameStarted.value = true
  loadBest()
  clearInterval(interval)
  interval = setInterval(() => elapsed.value++, 1000)
}

function exitGame() {
  clearInterval(interval)
  gameStarted.value = false
}

function isFaceUp(card) {
  return flipped.value.includes(card.id) || matchedIds.value.includes(card.id)
}

function isMatched(card) {
  return matchedIds.value.includes(card.id)
}

function flipCard(card) {
  if (lock.value || won.value) return
  if (matchedIds.value.includes(card.id) || flipped.value.includes(card.id)) return

  flipped.value.push(card.id)
  if (flipped.value.length < 2) return

  moves.value++
  const [a, b] = flipped.value.map(id => deck.value.find(c => c.id === id))
  if (a.emoji === b.emoji) {
    matchedIds.value.push(a.id, b.id)
    flipped.value = []
    if (matchedIds.value.length === deck.value.length) {
      clearInterval(interval)
      saveBest()
      increment('wins')
      won.value = true
    }
  } else {
    lock.value = true
    flipTimeout = setTimeout(() => {
      flipped.value = []
      lock.value = false
    }, 700)
  }
}

onUnmounted(() => { clearInterval(interval); clearTimeout(flipTimeout) })
</script>

<style scoped>
.memory-card { perspective: 600px; aspect-ratio: 1 / 1; cursor: pointer; }
.memory-card-inner {
  position: relative; width: 100%; height: 100%;
  transition: transform 0.4s; transform-style: preserve-3d;
}
.memory-card-inner.is-flipped { transform: rotateY(180deg); }
.memory-card-face {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  border-radius: 0.75rem; backface-visibility: hidden;
  font-size: clamp(1.2rem, 5vw, 2rem); user-select: none;
}
.memory-card-back { background: linear-gradient(135deg,#4f46e5,#8b5cf6); }
.memory-card-front {
  background: #f9fafb; border: 2px solid #e5e7eb;
  transform: rotateY(180deg);
}
.memory-card-front.matched { background: #d1fae5; border-color: #34d399; }
</style>
