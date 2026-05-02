<template>
  <GameLayout title="Connect Four" subtitle="Drop your pieces and get four in a row!" max-w="max-w-4xl">
    <div class="w-full max-w-4xl flex flex-col gap-5">

      <!-- Status + Scores -->
      <div class="grid grid-cols-3 gap-4">
        <BentoCard>
          <CardHeader icon="bx-user" icon-color="text-red-500">Player 1</CardHeader>
          <StatTile :value="scores.red" label="score" value-color="text-red-500" />
          <div :class="`text-xs font-medium text-center py-1 rounded-lg ${currentPlayer === 'red' && !gameOver ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`">
            {{ currentPlayer === 'red' && !gameOver ? 'Current Turn' : 'Waiting...' }}
          </div>
        </BentoCard>

        <BentoCard cls="items-center justify-center text-center">
          <CardHeader icon="bx-info-circle">Status</CardHeader>
          <p class="text-sm font-medium text-gray-600">{{ status }}</p>
        </BentoCard>

        <BentoCard>
          <CardHeader icon="bx-user" icon-color="text-yellow-500">Player 2</CardHeader>
          <StatTile :value="scores.yellow" label="score" value-color="text-yellow-500" />
          <div :class="`text-xs font-medium text-center py-1 rounded-lg ${currentPlayer === 'yellow' && !gameOver ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`">
            {{ currentPlayer === 'yellow' && !gameOver ? 'Current Turn' : 'Waiting...' }}
          </div>
        </BentoCard>
      </div>

      <!-- Board -->
      <BentoCard cls="items-center">
        <div class="bg-gradient-to-br from-slate-700 to-slate-900 p-4 rounded-2xl shadow-2xl">
          <div class="grid gap-2" style="grid-template-columns: repeat(7, 1fr);">
            <div
              v-for="(cell, idx) in flatBoard" :key="idx"
              @click="handleMove(idx % COLS)"
              :class="`w-12 h-12 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 shadow-inner
                ${cell === 'red' ? 'bg-red-500' : cell === 'yellow' ? 'bg-yellow-400' : 'bg-white/90'}
                ${winCells.has(idx) ? 'ring-4 ring-white animate-pulse' : ''}`"
            ></div>
          </div>
        </div>
        <div class="flex gap-3">
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
