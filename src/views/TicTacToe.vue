<template>
  <GameLayout title="Tic Tac Toe" subtitle="Get three in a row! Classic Xs and Os." max-w="max-w-3xl">
    <div class="w-full max-w-3xl flex flex-col gap-5">

      <!-- Scores -->
      <div class="grid grid-cols-3 gap-4">
        <BentoCard>
          <CardHeader icon="bx-x" icon-color="text-pink-500">Player X</CardHeader>
          <StatTile :value="scores.X" label="wins" value-color="text-pink-500" />
          <div :class="`text-xs font-medium text-center py-1 rounded-lg ${isXTurn && !winner && !isDraw ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'}`">
            {{ winner === 'X' ? '🏆 Winner!' : isDraw ? 'Draw' : isXTurn ? 'Current Turn' : 'Waiting...' }}
          </div>
        </BentoCard>

        <BentoCard cls="items-center justify-center text-center">
          <p class="text-sm font-medium text-gray-500">Turn</p>
          <p :class="`text-3xl font-bold ${isXTurn ? 'text-pink-500' : 'text-blue-500'}`">{{ isXTurn ? 'X' : 'O' }}</p>
          <p class="text-xs text-gray-400">{{ winner ? `${winner} wins!` : isDraw ? "It's a draw!" : 'playing' }}</p>
        </BentoCard>

        <BentoCard>
          <CardHeader icon="bx-radio-circle" icon-color="text-blue-500">Player O</CardHeader>
          <StatTile :value="scores.O" label="wins" value-color="text-blue-500" />
          <div :class="`text-xs font-medium text-center py-1 rounded-lg ${!isXTurn && !winner && !isDraw ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`">
            {{ winner === 'O' ? '🏆 Winner!' : isDraw ? 'Draw' : !isXTurn ? 'Current Turn' : 'Waiting...' }}
          </div>
        </BentoCard>
      </div>

      <!-- Board -->
      <BentoCard cls="items-center">
        <div class="grid grid-cols-3 gap-2" style="width: 300px; height: 300px;">
          <div
            v-for="(cell, i) in board" :key="i"
            @click="handleClick(i)"
            :class="`flex items-center justify-center text-4xl font-bold rounded-xl cursor-pointer transition-all select-none
              ${cell === 'X' ? 'text-pink-500' : cell === 'O' ? 'text-blue-500' : 'hover:bg-gray-200'}
              ${winCells.includes(i) ? 'bg-emerald-400 !text-white animate-pulse' : 'bg-gray-100'}`"
          >{{ cell || '' }}</div>
        </div>
        <div class="flex gap-3">
          <AppBtn icon="bx-refresh" @click="newGame">New Game</AppBtn>
          <AppBtn icon="bx-reset" variant="secondary" @click="resetScore">Reset Score</AppBtn>
        </div>
      </BentoCard>

    </div>
  </GameLayout>
</template>

<script setup>
import { ref } from 'vue'
import GameLayout from '../components/layouts/GameLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import StatTile   from '../components/ui/StatTile.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import { useScore } from '../composables/useScore.js'
import { checkWinner, isBoardFull } from '../utils/tictactoe.js'

const board    = ref(Array(9).fill(null))
const isXTurn  = ref(true)
const winner   = ref(null)
const winCells = ref([])
const isDraw   = ref(false)
const { scores, increment, reset: resetScores } = useScore(['X', 'O'])

function handleClick(i) {
  if (board.value[i] || winner.value || isDraw.value) return
  const mark = isXTurn.value ? 'X' : 'O'
  board.value[i] = mark

  const combo = checkWinner(board.value, mark)
  if (combo) {
    winner.value = mark; winCells.value = combo; increment(mark)
  } else if (isBoardFull(board.value)) {
    isDraw.value = true
  } else {
    isXTurn.value = !isXTurn.value
  }
}

function newGame() {
  board.value = Array(9).fill(null)
  isXTurn.value = true; winner.value = null; winCells.value = []; isDraw.value = false
}

function resetScore() { resetScores(); newGame() }
</script>
