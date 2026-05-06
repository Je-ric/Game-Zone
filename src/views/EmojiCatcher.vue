<template>
  <GameLayout title="Emoji Catcher" subtitle="Catch the emojis as fast as you can!">
    <template #howtoplay>
      <ol class="list-decimal list-inside space-y-2">
        <li>Choose a <strong>game mode</strong> (Single Emoji or Random Emoji) and a <strong>duration</strong>, then click <em>Start Game</em>.</li>
        <li>An emoji will appear on one of the <strong>10 tiles</strong> on the board.</li>
        <li><strong>Click the tile</strong> with the emoji as fast as you can to score a point.</li>
        <li>The emoji moves to a new tile every 0.6 seconds — be quick!</li>
        <li>When the timer runs out, your final score is shown. Click <em>Play Again</em> to restart.</li>
      </ol>
    </template>

    <!-- Desktop: Settings | Board | Stats — Mobile: stacked -->
    <div class="w-full grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] gap-5 items-start">

      <!-- Settings — left -->
      <BentoCard>
        <CardHeader icon="bx-slider">Settings</CardHeader>
        <div class="flex flex-col gap-4">
          <div>
            <p class="text-xs text-gray-400 font-medium mb-2">Emoji Mode</p>
            <div class="flex flex-col gap-2">
              <label v-for="m in emojiModes" :key="m.value"
                class="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                <input type="radio" :value="m.value" v-model="emojiMode" class="accent-indigo-500" />
                {{ m.label }}
              </label>
            </div>
          </div>
          <div>
            <p class="text-xs text-gray-400 font-medium mb-1">Duration</p>
            <select v-model="selectedDuration"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-gray-50">
              <option value="10">10 Seconds</option>
              <option value="30">30 Seconds</option>
              <option value="60">60 Seconds</option>
              <option value="90">90 Seconds</option>
              <option value="120">120 Seconds</option>
            </select>
          </div>
          <AppBtn @click="startGame" :disabled="isGameActive" icon="bx-play" cls="w-full justify-center">
            Start Game
          </AppBtn>
        </div>
      </BentoCard>

      <!-- Board — center -->
      <BentoCard cls="items-center">
        <CardHeader icon="bx-grid-alt">Game Board</CardHeader>
        <div class="grid grid-cols-5 gap-3 w-full">
          <div
            v-for="i in 10" :key="i"
            @mousedown="clickTile(i)"
            :class="`aspect-square rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 shadow-sm
              ${activeTile === i ? 'ring-2 ring-indigo-400' : 'bg-gray-100'}`"
            :style="activeTile === i ? { backgroundImage: `url('${currentEmoji}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"
          ></div>
        </div>
      </BentoCard>

      <!-- Stats — right -->
      <div class="flex flex-col gap-4">
        <BentoCard>
          <CardHeader icon="bx-trophy" icon-color="text-amber-500">Score</CardHeader>
          <StatTile :value="score" label="emojis caught" value-color="text-indigo-600" />
        </BentoCard>
        <BentoCard>
          <CardHeader icon="bx-time" icon-color="text-rose-500">Time Left</CardHeader>
          <StatTile :value="timeLeft" label="seconds remaining" value-color="text-rose-500" />
          <!-- Timer bar -->
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
            <div class="h-full rounded-full transition-all duration-300"
              :style="{ width: timeLeft > 0 ? (timeLeft / parseInt(selectedDuration) * 100) + '%' : '0%', background: 'linear-gradient(90deg,#f43f5e,#fb923c)' }">
            </div>
          </div>
        </BentoCard>
      </div>

    </div>

    <GameModal
      :visible="modal.visible.value"
      title="Game Over!"
      :message="`Your final score is ${score}`"
      emoji="🎮"
      accent-class="bg-gradient-to-r from-indigo-500 to-purple-500"
    >
      <AppBtn @click="restartGame" icon="bx-refresh" cls="w-full justify-center">Play Again</AppBtn>
    </GameModal>
  </GameLayout>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import GameLayout from '../components/layouts/GameLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import StatTile   from '../components/ui/StatTile.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import GameModal  from '../components/ui/GameModal.vue'
import { useGameTimer } from '../composables/useGameTimer.js'
import { useModal }     from '../composables/useModal.js'

const emojiImages = [
  '/emoji/disappointed_relieved.png', '/emoji/exploding_head.png', '/emoji/expressionless.png',
  '/emoji/face_with_cowboy_hat.png',  '/emoji/face_with_symbols_on_mouth.png', '/emoji/face_with_rolling_eyes.png',
  '/emoji/heart_eyes.png',            '/emoji/innocent.png',        '/emoji/kissing_closed_eyes.png',
  '/emoji/kissing_heart.png',         '/emoji/money_mouth_face.png', '/emoji/nauseated_face.png',
  '/emoji/nerd_face.png',             '/emoji/scream.png',           '/emoji/sleeping.png',
  '/emoji/sob.png',                   '/emoji/star-struck.png',      '/emoji/stuck_out_tongue_closed_eyes.png',
  '/emoji/sunglasses.png',            '/emoji/sweat_smile.png',      '/emoji/zany_face.png',
]

const emojiModes = [{ value: 'single', label: 'Single Emoji' }, { value: 'random', label: 'Random Emoji' }]
const emojiMode = ref('single')
const selectedDuration = ref('60')
const score = ref(0)
const activeTile = ref(null)
const currentEmoji = ref(emojiImages[0])
const isGameActive = ref(false)
const modal = useModal()
let emojiInterval = null

const { timeLeft, start: startTimer, stop: stopTimer } = useGameTimer(() => {
  clearInterval(emojiInterval)
  isGameActive.value = false
  activeTile.value = null
  modal.show()
})

function startGame() {
  if (isGameActive.value) return
  score.value = 0; isGameActive.value = true; modal.hide()
  if (emojiMode.value === 'single') currentEmoji.value = emojiImages[Math.floor(Math.random() * emojiImages.length)]
  emojiInterval = setInterval(() => {
    activeTile.value = null
    setTimeout(() => {
      if (emojiMode.value === 'random') currentEmoji.value = emojiImages[Math.floor(Math.random() * emojiImages.length)]
      activeTile.value = Math.floor(Math.random() * 10) + 1
    }, 50)
  }, 600)
  startTimer(parseInt(selectedDuration.value))
}

function clickTile(i) {
  if (!isGameActive.value || activeTile.value !== i) return
  score.value++; activeTile.value = null
}

function restartGame() {
  clearInterval(emojiInterval); stopTimer()
  isGameActive.value = false; modal.hide()
  startGame()
}

onUnmounted(() => { clearInterval(emojiInterval); stopTimer() })
</script>
