<template>
  <GameLayout title="Word Scramble" subtitle="Unscramble the letters to form the correct word.">
    <template #howtoplay>
      <ol class="list-decimal list-inside space-y-2">
        <li>Click <strong>Start Game</strong> to begin. A scrambled word will appear.</li>
        <li>Read the <strong>hint</strong> for a clue about the word.</li>
        <li>Type your answer and press <strong>Enter</strong> or click <em>Check Word</em>.</li>
        <li>You have <strong>30 seconds</strong> per word — the timer starts when the game begins.</li>
        <li>If time runs out, the correct word is revealed and a new word loads automatically.</li>
        <li>Click <em>Skip Word</em> to move to a new word at any time.</li>
      </ol>
    </template>

    <div class="w-full flex justify-center">
      <div class="w-full max-w-2xl flex flex-col gap-5">

        <!-- Start screen -->
        <template v-if="!gameStarted">
          <BentoCard cls="items-center text-center">
            <div class="text-6xl mb-2">🔤</div>
            <h2 class="text-2xl font-bold text-gray-800">Word Scramble</h2>
            <p class="text-gray-400 text-sm max-w-xs">
              Unscramble the letters to form the correct word before the timer runs out!
            </p>
            <div class="flex flex-col gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl px-5 py-3 w-full text-left">
              <p>⏱ 30 seconds per word</p>
              <p>💡 Hints provided for each word</p>
              <p>🔄 Skip words anytime</p>
            </div>
            <AppBtn icon="bx-play" cls="px-10 self-center" @click="startGameSession">
              Start Game
            </AppBtn>
          </BentoCard>
        </template>

        <!-- Game screen -->
        <template v-else>
          <BentoCard>
            <CardHeader icon="bx-shuffle">Scrambled Word</CardHeader>
            <div class="bg-gray-50 rounded-xl p-5 text-center">
              <p class="text-4xl font-bold tracking-widest text-indigo-600 break-all uppercase">{{ scrambled }}</p>
            </div>
          </BentoCard>

          <div class="grid grid-cols-2 gap-5">
            <BentoCard>
              <CardHeader icon="bx-info-circle" icon-color="text-amber-500">Hint</CardHeader>
              <p class="text-gray-600 text-sm">{{ hint }}</p>
            </BentoCard>
            <BentoCard>
              <CardHeader icon="bx-time" icon-color="text-rose-500">Time Left</CardHeader>
              <StatTile :value="timeLeft" label="seconds remaining" value-color="text-rose-500" />
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                <div class="h-full rounded-full transition-all duration-300"
                  :style="{ width: (timeLeft / 30 * 100) + '%', background: timeLeft > 10 ? '#22c55e' : '#f43f5e' }">
                </div>
              </div>
            </BentoCard>
          </div>

          <BentoCard>
            <CardHeader icon="bx-edit">Your Answer</CardHeader>
            <input
              ref="inputRef"
              v-model="userInput"
              type="text"
              spellcheck="false"
              placeholder="Type the correct word…"
              :maxlength="correctWord.length"
              @keydown.enter="checkWord"
              class="w-full h-12 px-4 text-base border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <div class="flex gap-3">
              <AppBtn icon="bx-skip-next" variant="warning" cls="flex-1" @click="initGame">Skip Word</AppBtn>
              <AppBtn icon="bx-check" cls="flex-1" @click="checkWord">Check Word</AppBtn>
            </div>
          </BentoCard>
        </template>

      </div>
    </div>

    <transition name="slide">
      <div v-if="toast.show" :class="`fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl font-semibold text-white shadow-xl z-50 ${toast.color}`">
        {{ toast.msg }}
      </div>
    </transition>
  </GameLayout>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import GameLayout from '../components/layouts/GameLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import StatTile   from '../components/ui/StatTile.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import { useGameTimer } from '../composables/useGameTimer.js'
import { scrambleWord, pickRandom } from '../utils/wordScramble.js'

const words = ref([])
const scrambled = ref('')
const hint = ref('')
const correctWord = ref('')
const userInput = ref('')
const gameStarted = ref(false)
const inputRef = ref(null)
const toast = ref({ show: false, msg: '', color: '' })

const { timeLeft, start } = useGameTimer(() => {
  showToast(`⏰ Time's up! The word was: ${correctWord.value.toUpperCase()}`, 'bg-red-500')
  setTimeout(initGame, 2500)
})

fetch('/words.json')
  .then(r => r.json())
  .then(data => { words.value = data })
  .catch(() => showToast('⚠️ Unable to load words.', 'bg-amber-500'))

function startGameSession() {
  gameStarted.value = true
  nextTick(() => initGame())
}

function initGame() {
  if (!words.value.length) return
  const obj = pickRandom(words.value)
  correctWord.value = obj.word.toLowerCase()
  hint.value = obj.hint
  scrambled.value = scrambleWord(correctWord.value)
  userInput.value = ''
  start(30)
  nextTick(() => inputRef.value?.focus())
}

function checkWord() {
  const input = userInput.value.toLowerCase().trim()
  if (!input) { showToast('Please enter the word!', 'bg-amber-500'); return }
  if (input === correctWord.value) {
    showToast(`🎉 Correct! "${correctWord.value.toUpperCase()}" is right!`, 'bg-emerald-500')
    setTimeout(initGame, 2000)
  } else {
    showToast(`Oops! "${input}" is not correct.`, 'bg-red-500')
  }
}

function showToast(msg, color) {
  toast.value = { show: true, msg, color }
  setTimeout(() => { toast.value.show = false }, 2000)
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from { opacity: 0; transform: translate(-50%, -20px); }
.slide-leave-to   { opacity: 0; transform: translate(-50%, -20px); }
</style>
