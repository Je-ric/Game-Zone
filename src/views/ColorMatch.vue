<template>
  <GameLayout title="Color Match" subtitle="Match the displayed color with the correct option below!" max-w="max-w-2xl">
    <div class="w-full max-w-2xl flex flex-col gap-5">

      <div class="grid grid-cols-2 gap-5">
        <BentoCard>
          <CardHeader icon="bx-slider">Difficulty</CardHeader>
          <select v-model="difficulty" @change="startGame" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 bg-gray-50">
            <option value="3">Easy (3 colors)</option>
            <option value="6">Medium (6 colors)</option>
            <option value="9">Hard (9 colors)</option>
          </select>
          <AppBtn variant="ghost" icon="bx-refresh" @click="restart">Restart</AppBtn>
        </BentoCard>
        <BentoCard>
          <CardHeader icon="bx-trophy" icon-color="text-amber-500">Score</CardHeader>
          <StatTile :value="score" label="correct guesses" value-color="text-indigo-600" />
        </BentoCard>
      </div>

      <BentoCard>
        <CardHeader icon="bx-palette">Guess This Color</CardHeader>
        <div class="bg-gray-50 rounded-xl p-4 text-center">
          <p class="font-semibold text-indigo-600">{{ targetColor }}</p>
          <p class="text-sm text-gray-400 mt-1">HEX: {{ targetHex }}</p>
        </div>
        <div :class="`grid gap-3 ${difficulty == 3 ? 'grid-cols-3' : 'grid-cols-3'}`">
          <button
            v-for="(color, i) in colors" :key="i"
            @click="guess(color)"
            :style="{ backgroundColor: color, outline: color === highlightColor ? '4px solid #10b981' : 'none', boxShadow: color === highlightColor ? '0 0 15px #10b981' : '' }"
            :disabled="disabled"
            class="aspect-square rounded-xl border-none cursor-pointer hover:-translate-y-1 transition-transform shadow disabled:cursor-not-allowed"
          ></button>
        </div>

        <!-- Timer bar -->
        <div v-if="disabled" class="space-y-1">
          <div class="text-xs text-gray-400 text-center">Next round in {{ timerSec }}s</div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-indigo-400 to-pink-400 transition-all" :style="{ width: timerPct + '%' }"></div>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <span :class="`font-semibold ${feedback === '✅ Correct!' ? 'text-emerald-500' : feedback === '❌ Wrong!' ? 'text-red-500' : 'text-transparent'}`">
            {{ feedback || '—' }}
          </span>
        </div>
      </BentoCard>

    </div>
  </GameLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import GameLayout from '../components/layouts/GameLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import StatTile   from '../components/ui/StatTile.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import { generateColors, toHex } from '../utils/colorMatch.js'

const difficulty = ref('6')
const colors = ref([])
const targetColor = ref('')
const targetHex = ref('')
const highlightColor = ref('')
const feedback = ref('')
const score = ref(0)
const disabled = ref(false)
const timerPct = ref(100)
const timerSec = ref(0)
const nextRoundDelay = 2500
let timerInterval = null

function startGame() {
  clearInterval(timerInterval)
  disabled.value = false; feedback.value = ''; highlightColor.value = ''; timerPct.value = 100

  colors.value = generateColors(parseInt(difficulty.value))
  targetColor.value = colors.value[Math.floor(Math.random() * colors.value.length)]
  targetHex.value = toHex(targetColor.value)
}

function guess(color) {
  if (disabled.value) return
  disabled.value = true
  if (color === targetColor.value) { feedback.value = '✅ Correct!'; score.value++ }
  else { feedback.value = '❌ Wrong!'; highlightColor.value = targetColor.value }
  startTimer()
  setTimeout(startGame, nextRoundDelay)
}

function startTimer() {
  const end = Date.now() + nextRoundDelay
  timerInterval = setInterval(() => {
    const left = Math.max(0, end - Date.now())
    timerPct.value = (left / nextRoundDelay) * 100
    timerSec.value = (left / 1000).toFixed(1)
    if (left <= 0) clearInterval(timerInterval)
  }, 100)
}

function restart() { score.value = 0; startGame() }

onMounted(startGame)
onUnmounted(() => clearInterval(timerInterval))
</script>
