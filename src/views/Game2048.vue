<template>
  <GameLayout title="2048" subtitle="Join the tiles, get to 2048!">
    <template #howtoplay>
      <ol class="list-decimal list-inside space-y-2">
        <li>Use the <strong>arrow keys</strong> (or WASD / the on-screen arrows) to slide all tiles.</li>
        <li>When two tiles with the <strong>same number</strong> touch, they merge into one — worth their sum.</li>
        <li>Each move spawns a new tile (2 or 4) on an empty cell.</li>
        <li>Reach the <strong>2048 tile</strong> to win — then keep going for a higher score.</li>
        <li>The game ends when the board is full and no tiles can merge.</li>
        <li>On mobile, <strong>swipe</strong> across the board to move the tiles.</li>
      </ol>
    </template>

    <div class="w-full flex justify-center">
      <div class="w-full max-w-md flex flex-col gap-5">

        <div class="grid grid-cols-2 gap-5">
          <BentoCard>
            <CardHeader icon="bx-coin" icon-color="text-amber-500">Score</CardHeader>
            <StatTile :value="score" label="current score" value-color="text-amber-500" />
          </BentoCard>
          <BentoCard>
            <CardHeader icon="bx-trophy" icon-color="text-indigo-500">Best</CardHeader>
            <StatTile :value="best" label="best score" value-color="text-indigo-500" />
          </BentoCard>
        </div>

        <BentoCard cls="items-center">
          <div class="rounded-xl p-3 select-none touch-none" style="background:#bbada0"
            @touchstart.prevent="onTouchStart" @touchend.prevent="onTouchEnd">
            <div class="grid gap-3" style="grid-template-columns: repeat(4, minmax(0, 1fr))">
              <div v-for="(cell, i) in flatBoard" :key="i"
                class="rounded-lg flex items-center justify-center font-bold"
                :style="[cellStyle, tileStyle(cell)]">
                <span :class="cell >= 1024 ? 'text-sm sm:text-base' : cell >= 128 ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'">
                  {{ cell || '' }}
                </span>
              </div>
            </div>
          </div>

          <!-- On-screen arrows (handy on mobile) -->
          <div class="grid grid-cols-3 gap-2 w-40 mt-1">
            <div></div>
            <AppBtn icon="bx-up-arrow" variant="secondary" cls="!px-0" @click="handleMove('up')" />
            <div></div>
            <AppBtn icon="bx-left-arrow" variant="secondary" cls="!px-0" @click="handleMove('left')" />
            <AppBtn icon="bx-down-arrow" variant="secondary" cls="!px-0" @click="handleMove('down')" />
            <AppBtn icon="bx-right-arrow" variant="secondary" cls="!px-0" @click="handleMove('right')" />
          </div>

          <div class="flex gap-3">
            <AppBtn icon="bx-refresh" @click="newGame">New Game</AppBtn>
          </div>
        </BentoCard>

      </div>
    </div>

    <GameModal :visible="gameOver" :emoji="'🧩'" :title="'Game Over!'"
      :message="`Final score: ${score}. ${reached2048 ? 'You reached 2048 — nice!' : 'Keep joining tiles to reach 2048.'}`"
      accent-class="bg-gradient-to-r from-amber-500 to-orange-500">
      <AppBtn icon="bx-refresh" cls="self-center" @click="newGame">Play Again</AppBtn>
    </GameModal>

    <transition name="slide">
      <div v-if="toast" class="fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl font-semibold text-white shadow-xl z-50 bg-emerald-500">
        {{ toast }}
      </div>
    </transition>
  </GameLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import GameLayout from '../components/layouts/GameLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import StatTile   from '../components/ui/StatTile.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import GameModal  from '../components/ui/GameModal.vue'
import { createBoard, spawn, move, canMove, hasTarget, tileStyle, SIZE } from '../utils/game2048.js'

const board      = ref(createBoard())
const score      = ref(0)
const best       = ref(Number(localStorage.getItem('gamezone-2048-best')) || 0)
const gameOver   = ref(false)
const reached2048 = ref(false)
const toast      = ref('')

const flatBoard = computed(() => board.value.flat())
const cellStyle = { width: 'clamp(56px, 16vw, 78px)', height: 'clamp(56px, 16vw, 78px)' }

let toastTimer = null
let touchStart = null

function handleMove(dir) {
  if (gameOver.value) return
  const result = move(board.value, dir)
  if (!result.moved) return

  board.value = result.board
  score.value += result.gained
  spawn(board.value)

  if (score.value > best.value) {
    best.value = score.value
    localStorage.setItem('gamezone-2048-best', String(best.value))
  }

  if (!reached2048.value && hasTarget(board.value)) {
    reached2048.value = true
    showToast('🎉 You reached 2048! Keep going for a high score!')
  }

  if (!canMove(board.value)) gameOver.value = true
}

function newGame() {
  board.value = createBoard()
  score.value = 0
  gameOver.value = false
  reached2048.value = false
}

function showToast(msg) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3000)
}

function onKey(e) {
  const map = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right',
    W: 'up', S: 'down', A: 'left', D: 'right',
  }
  const dir = map[e.key]
  if (!dir) return
  e.preventDefault()
  handleMove(dir)
}

function onTouchStart(e) {
  const t = e.changedTouches[0]
  touchStart = { x: t.clientX, y: t.clientY }
}

function onTouchEnd(e) {
  if (!touchStart) return
  const t = e.changedTouches[0]
  const dx = t.clientX - touchStart.x
  const dy = t.clientY - touchStart.y
  touchStart = null
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return
  if (Math.abs(dx) > Math.abs(dy)) handleMove(dx > 0 ? 'right' : 'left')
  else handleMove(dy > 0 ? 'down' : 'up')
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
