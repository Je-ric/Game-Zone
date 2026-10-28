<template>
  <GameLayout title="Word Guess" subtitle="Guess the 5-letter word in 6 tries.">
    <template #howtoplay>
      <ol class="list-decimal list-inside space-y-2">
        <li>Click <strong>Start Game</strong> to reveal your first puzzle — a hidden 5-letter word.</li>
        <li>Type a 5-letter word with your <strong>keyboard</strong> or the on-screen keys, then press <strong>Enter</strong>.</li>
        <li>🟩 <strong>Green</strong> — the letter is correct and in the right spot.</li>
        <li>🟨 <strong>Yellow</strong> — the letter is in the word but in the wrong spot.</li>
        <li>⬜ <strong>Gray</strong> — the letter is not in the word at all.</li>
        <li>You have <strong>6 attempts</strong> to find the word. Win streaks are saved on this device.</li>
      </ol>
    </template>

    <div class="w-full flex justify-center">
      <div class="w-full max-w-md flex flex-col gap-5">

        <!-- Start screen -->
        <template v-if="!gameStarted">
          <BentoCard cls="items-center text-center">
            <div class="text-6xl mb-2">🟩🟨</div>
            <h2 class="text-2xl font-bold text-gray-800">Word Guess</h2>
            <p class="text-gray-400 text-sm max-w-xs">
              Crack the hidden 5-letter word in six tries or fewer.
            </p>
            <div class="flex flex-col gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl px-5 py-3 w-full text-left">
              <p>🟩 Correct letter and spot</p>
              <p>🟨 Right letter, wrong spot</p>
              <p>⬜ Letter not in the word</p>
            </div>
            <AppBtn icon="bx-play" cls="px-10 self-center" @click="startGame">
              Start Game
            </AppBtn>
          </BentoCard>
        </template>

        <!-- Game screen -->
        <template v-else>
          <div class="grid grid-cols-3 gap-5">
            <BentoCard>
              <CardHeader icon="bx-grid" icon-color="text-teal-500">Try</CardHeader>
              <StatTile :value="`${rows.length}/${MAX_ROWS}`" label="attempt" value-color="text-teal-500" />
            </BentoCard>
            <BentoCard>
              <CardHeader icon="bx-chevrons-up" icon-color="text-orange-500">Streak</CardHeader>
              <StatTile :value="streak" label="in a row" value-color="text-orange-500" />
            </BentoCard>
            <BentoCard>
              <CardHeader icon="bx-trophy" icon-color="text-indigo-500">Wins</CardHeader>
              <StatTile :value="scores.wins" label="total" value-color="text-indigo-500" />
            </BentoCard>
          </div>

          <BentoCard cls="items-center">
            <!-- Board -->
            <div class="grid gap-1.5" :style="{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }">
              <template v-for="r in MAX_ROWS" :key="r">
                <div v-for="c in COLS" :key="c"
                  :class="tileClass(r - 1, c - 1)"
                  :style="tileStyle(r - 1, c - 1)">
                  {{ letterAt(r - 1, c - 1) }}
                </div>
              </template>
            </div>

            <!-- On-screen keyboard -->
            <div class="flex flex-col gap-1.5 w-full max-w-sm mt-1">
              <div v-for="(row, ri) in KEY_ROWS" :key="ri" class="flex justify-center gap-1.5">
                <button v-for="key in row" :key="key" @click="pressKey(key)"
                  :class="keyClass(key)">
                  {{ key === 'Back' ? '⌫' : key === 'Enter' ? 'Enter' : key.toUpperCase() }}
                </button>
              </div>
            </div>

            <AppBtn v-if="finished" icon="bx-refresh" @click="startGame">Play Again</AppBtn>
          </BentoCard>
        </template>

      </div>
    </div>

    <GameModal :visible="finished" :emoji="won ? '🎉' : '🙈'"
      :title="won ? `Solved in ${rows.length}!` : 'Out of tries!'"
      :message="`The word was “${answer.toUpperCase()}”. ${won ? 'Nice streak going — keep it up!' : 'Better luck next round.'}`"
      accent-class="bg-gradient-to-r from-teal-500 to-emerald-500">
      <AppBtn icon="bx-refresh" cls="self-center" @click="startGame">Play Again</AppBtn>
    </GameModal>

    <transition name="slide">
      <div v-if="toast" class="fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl font-semibold text-white shadow-xl z-50 bg-amber-500">
        {{ toast }}
      </div>
    </transition>
  </GameLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import GameLayout from '../components/layouts/GameLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import StatTile   from '../components/ui/StatTile.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import GameModal  from '../components/ui/GameModal.vue'
import { useScore } from '../composables/useScore.js'
import { ROWS as MAX_ROWS, COLS, KEY_ROWS, pickAnswer, isValidGuess, gradeGuess, mergeKeyStates } from '../utils/wordle.js'

const gameStarted = ref(false)
const answer      = ref('')
const rows        = ref([])      // [{ word, grades: ['correct'|'present'|'absent'] }]
const current     = ref('')
const keyStates   = ref({})      // letter -> status
const finished    = ref(false)
const won         = ref(false)
const toast       = ref('')
const streak      = ref(Number(localStorage.getItem('gamezone-wordle-streak')) || 0)

const { scores, increment } = useScore(['wins'])

let toastTimer = null

function startGame() {
  answer.value = pickAnswer(answer.value)
  rows.value = []
  current.value = ''
  keyStates.value = {}
  finished.value = false
  won.value = false
  gameStarted.value = true
}

function pressKey(key) {
  if (!gameStarted.value || finished.value) return
  if (key === 'Enter') return submitGuess()
  if (key === 'Back')  return backspace()
  if (/^[a-z]$/i.test(key) && current.value.length < COLS) {
    current.value += key.toLowerCase()
  }
}

function backspace() {
  current.value = current.value.slice(0, -1)
}

function submitGuess() {
  if (current.value.length < COLS) {
    showToast('Not enough letters!')
    return
  }
  if (!isValidGuess(current.value)) {
    showToast('Letters only!')
    return
  }

  const grades = gradeGuess(current.value, answer.value)
  rows.value.push({ word: current.value, grades })
  mergeKeyStates(keyStates.value, current.value, grades)

  if (current.value === answer.value) {
    won.value = true
    finished.value = true
    streak.value++
    increment('wins')
    localStorage.setItem('gamezone-wordle-streak', String(streak.value))
  } else if (rows.value.length >= MAX_ROWS) {
    finished.value = true
    streak.value = 0
    localStorage.setItem('gamezone-wordle-streak', '0')
  }
  current.value = ''
}

function letterAt(r, c) {
  if (r < rows.value.length) return rows.value[r].word[c]
  if (r === rows.value.length) return current.value[c] || ''
  return ''
}

function tileClass(r, c) {
  const submitted = r < rows.value.length
  const base = 'w-12 h-12 sm:w-14 sm:h-14 rounded-md flex items-center justify-center text-2xl font-bold uppercase select-none transition-colors'
  if (!submitted) {
    const active = r === rows.value.length && !finished.value
    return `${base} border-2 ${active ? 'border-gray-400' : 'border-gray-200'} bg-white`
  }
  const status = rows.value[r].grades[c]
  const colors = {
    correct: 'bg-emerald-500 text-white border-emerald-500',
    present: 'bg-amber-400 text-white border-amber-400',
    absent:  'bg-gray-400 text-white border-gray-400',
  }
  return `${base} border-2 ${colors[status]}`
}

function tileStyle(r, c) {
  if (r >= rows.value.length) return {}
  return { animationDelay: `${c * 0.25}s` }
}

function keyClass(key) {
  const wide = key === 'Enter' || key === 'Back'
  const state = keyStates.value[key.toLowerCase()]
  const colors = {
    correct: 'bg-emerald-500 text-white',
    present: 'bg-amber-400 text-white',
    absent:  'bg-gray-400 text-white',
  }
  const stateClass = state ? colors[state] : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  return `${wide ? 'px-3 text-xs' : 'w-8 sm:w-9 text-sm'} h-11 rounded-md font-bold transition-colors ${stateClass}`
}

function showToast(msg) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 1800)
}

function onKey(e) {
  if (e.key === 'Enter') { e.preventDefault(); pressKey('Enter') }
  else if (e.key === 'Backspace') pressKey('Back')
  else if (/^[a-zA-Z]$/.test(e.key)) pressKey(e.key)
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  clearTimeout(toastTimer)
})
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from { opacity: 0; transform: translate(-50%, -20px); }
.slide-leave-to   { opacity: 0; transform: translate(-50%, -20px); }
</style>
