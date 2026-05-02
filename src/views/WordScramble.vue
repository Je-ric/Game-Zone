<template>
  <GameLayout title="Word Scramble" subtitle="Unscramble the letters to form the correct word." max-w="max-w-2xl">
    <div class="w-full max-w-2xl flex flex-col gap-5">

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
        </BentoCard>
      </div>

      <BentoCard>
        <CardHeader icon="bx-edit">Your Answer</CardHeader>
        <input
          v-model="userInput"
          type="text"
          spellcheck="false"
          placeholder="Enter the correct word"
          :maxlength="correctWord.length"
          @keydown.enter="checkWord"
          class="w-full h-12 px-4 text-base border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
        />
        <div class="flex gap-3">
          <AppBtn icon="bx-refresh" variant="warning" cls="flex-1" @click="initGame">Refresh Word</AppBtn>
          <AppBtn icon="bx-check" cls="flex-1" @click="checkWord">Check Word</AppBtn>
        </div>
      </BentoCard>

    </div>

    <!-- Toast -->
    <transition name="slide">
      <div v-if="toast.show" :class="`fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl font-semibold text-white shadow-xl z-50 ${toast.color}`">
        {{ toast.msg }}
      </div>
    </transition>
  </GameLayout>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
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
const toast = ref({ show: false, msg: '', color: '' })

const { timeLeft, start } = useGameTimer(() => {
  showToast(`⏰ Time's up! The word was: ${correctWord.value.toUpperCase()}`, 'bg-red-500')
  setTimeout(initGame, 2500)
})

fetch('/words.json')
  .then(r => r.json())
  .then(data => { words.value = data; initGame() })
  .catch(() => showToast('⚠️ Unable to load words.', 'bg-amber-500'))

function initGame() {
  if (!words.value.length) return
  const obj = pickRandom(words.value)
  correctWord.value = obj.word.toLowerCase()
  hint.value = obj.hint
  scrambled.value = scrambleWord(correctWord.value)
  userInput.value = ''
  start(30)
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
