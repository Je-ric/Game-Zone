<template>
  <GameLayout title="Connect Four" subtitle="Drop your pieces and get four in a row!">
    <template #howtoplay>
      <ol class="list-decimal list-inside space-y-2">
        <li>Players take turns <strong>clicking a column</strong> to drop their piece.</li>
        <li>Player 1 is <strong class="text-red-500">Red</strong>, Player 2 is <strong class="text-yellow-500">Yellow</strong>.</li>
        <li>Pieces fall to the <strong>lowest available row</strong> in the chosen column.</li>
        <li>First to connect <strong>4 pieces</strong> in a row — horizontally, vertically, or diagonally — wins.</li>
        <li>If the board fills with no winner, it's a <strong>draw</strong>.</li>
        <li>Click <em>New Round</em> to reset the board, or <em>New Game</em> to reset scores too.</li>
      </ol>
    </template>

    <div class="w-full flex flex-col gap-5">

      <!-- Mobile score bar -->
      <div class="flex lg:hidden gap-4">
        <BentoCard cls="flex-1 items-center text-center">
          <div class="w-6 h-6 rounded-full bg-red-500 mx-auto mb-1"></div>
          <CardHeader icon="bx-user" icon-color="text-red-500">Player 1</CardHeader>
          <StatTile :value="scores.red" label="score" value-color="text-red-500" />
          <div :class="`text-xs font-medium py-1 px-2 rounded-lg ${currentPlayer === 'red' && !gameOver ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`">
            {{ currentPlayer === 'red' && !gameOver ? 'Your Turn' : 'Waiting…' }}
          </div>
        </BentoCard>
        <BentoCard cls="flex-1 items-center text-center">
          <div class="w-6 h-6 rounded-full bg-yellow-400 mx-auto mb-1"></div>
          <CardHeader icon="bx-user" icon-color="text-yellow-500">Player 2</CardHeader>
          <StatTile :value="scores.yellow" label="score" value-color="text-yellow-500" />
          <div :class="`text-xs font-medium py-1 px-2 rounded-lg ${currentPlayer === 'yellow' && !gameOver ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`">
            {{ currentPlayer === 'yellow' && !gameOver ? 'Your Turn' : 'Waiting…' }}
          </div>
        </BentoCard>
      </div>

      <!-- Desktop 3-column layout -->
      <div class="hidden lg:grid grid-cols-[200px_1fr_200px] gap-6 items-center">

        <!-- Player 1 — left -->
        <BentoCard cls="items-center text-center">
          <div class="w-10 h-10 rounded-full bg-red-500 shadow-lg shadow-red-200 mx-auto"></div>
          <CardHeader icon="bx-user" icon-color="text-red-500">Player 1</CardHeader>
          <StatTile :value="scores.red" label="score" value-color="text-red-500" />
          <div :class="`text-xs font-medium w-full text-center py-1.5 rounded-lg ${currentPlayer === 'red' && !gameOver ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`">
            {{ currentPlayer === 'red' && !gameOver ? '← Your Turn' : 'Waiting…' }}
          </div>
        </BentoCard>

        <!-- Board — center -->
        <BentoCard cls="items-center">
          <p class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{{ status }}</p>
          <div class="bg-gradient-to-br from-slate-700 to-slate-900 p-4 rounded-2xl shadow-2xl">
            <div class="grid gap-2" style="grid-template-columns: repeat(7, 1fr);">
              <div v-for="(cell, idx) in flatBoard" :key="idx"
                @click="handleMove(idx % COLS)"
                :class="`w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 shadow-inner
                  ${cell === 'red' ? 'bg-red-500' : cell === 'yellow' ? 'bg-yellow-400' : 'bg-white/90'}
                  ${winCells.has(idx) ? 'ring-4 ring-white animate-pulse' : ''}`">
              </div>
            </div>
          </div>
          <div class="flex gap-3 mt-2">
            <AppBtn variant="primary" icon="bx-refresh" @click="newRound">New Round</AppBtn>
            <AppBtn variant="danger" icon="bx-reset" @click="newGame">New Game</AppBtn>
          </div>
        </BentoCard>

        <!-- Player 2 — right -->
        <BentoCard cls="items-center text-center">
          <div class="w-10 h-10 rounded-full bg-yellow-400 shadow-lg shadow-yellow-200 mx-auto"></div>
          <CardHeader icon="bx-user" icon-color="text-yellow-500">Player 2</CardHeader>
          <StatTile :value="scores.yellow" label="score" value-color="text-yellow-500" />
          <div :class="`text-xs font-medium w-full text-center py-1.5 rounded-lg ${currentPlayer === 'yellow' && !gameOver ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`">
            {{ currentPlayer === 'yellow' && !gameOver ? 'Your Turn →' : 'Waiting…' }}
          </div>
        </BentoCard>
      </div>

      <!-- Mobile board -->
      <BentoCard cls="items-center lg:hidden">
        <p class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{{ status }}</p>
        <div class="bg-gradient-to-br from-slate-700 to-slate-900 p-3 rounded-2xl shadow-2xl">
          <div class="grid gap-1.5" style="grid-template-columns: repeat(7, 1fr);">
            <div v-for="(cell, idx) in flatBoard" :key="idx"
              @click="handleMove(idx % COLS)"
              :class="`w-9 h-9 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 shadow-inner
                ${cell === 'red' ? 'bg-red-500' : cell === 'yellow' ? 'bg-yellow-400' : 'bg-white/90'}
                ${winCells.has(idx) ? 'ring-4 ring-white animate-pulse' : ''}`">
            </div>
          </div>
        </div>
        <div class="flex gap-3 mt-2">
          <AppBtn variant="primary" icon="bx-refresh" @click="newRound">New Round</AppBtn>
          <AppBtn variant="danger" icon="bx-reset" @click="newGame">New Game</AppBtn>
        </div>
      </BentoCard>

    </div>
  </GameLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import GameLayout from '../components/layouts/GameLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import StatTile   from '../components/ui/StatTile.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import { useScore } from '../composables/useScore.js'
import { ROWS, COLS, emptyBoard, dropPiece, checkWinner, getWinCells, isBoardFull } from '../utils/connectFour.js'

const board = ref(emptyBoard())
const currentPlayer = ref('red')
const gameOver = ref(false)
const status = ref("Player 1's turn (Red)")
const winCells = ref(new Set())
const { scores, increment } = useScore(['red', 'yellow'])

const flatBoard = computed(() => board.value.flat())

function handleMove(col) {
  if (gameOver.value) return
  const row = dropPiece(board.value, col, currentPlayer.value)
  if (row === -1) return
  board.value = [...board.value]
  if (checkWinner(board.value, row, col)) {
    gameOver.value = true
    increment(currentPlayer.value)
    status.value = `${currentPlayer.value === 'red' ? 'Player 1' : 'Player 2'} wins!`
    winCells.value = getWinCells(board.value, row, col)
  } else if (isBoardFull(board.value)) {
    status.value = "It's a draw!"
  } else {
    currentPlayer.value = currentPlayer.value === 'red' ? 'yellow' : 'red'
    status.value = `${currentPlayer.value === 'red' ? 'Player 1' : 'Player 2'}'s turn (${currentPlayer.value === 'red' ? 'Red' : 'Yellow'})`
  }
}

function newRound() {
  board.value = emptyBoard(); currentPlayer.value = 'red'
  gameOver.value = false; status.value = "Player 1's turn (Red)"; winCells.value = new Set()
}

function newGame() { scores.value = { red: 0, yellow: 0 }; newRound() }
</script>
