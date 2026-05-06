<template>
  <GameLayout title="Tic Tac Toe" subtitle="Get three in a row! Classic Xs and Os.">
    <template #howtoplay>
      <ol class="list-decimal list-inside space-y-2">
        <li>The board is a <strong>3×3 grid</strong>. Player X goes first.</li>
        <li>Take turns clicking an empty cell to place your mark (X or O).</li>
        <li>First player to get <strong>3 in a row</strong> — horizontally, vertically, or diagonally — wins.</li>
        <li>If all 9 cells are filled with no winner, it's a <strong>draw</strong>.</li>
        <li>Click <em>New Game</em> to play again. Scores persist until you click <em>Reset Score</em>.</li>
      </ol>
    </template>

    <!-- Desktop: Player X | Board | Player O — Mobile: stacked -->
    <div class="w-full flex flex-col gap-5">

      <!-- Mobile score bar -->
      <div class="flex lg:hidden gap-4">
        <BentoCard cls="flex-1 items-center text-center">
          <CardHeader icon="bx-x" icon-color="text-pink-500">Player X</CardHeader>
          <StatTile :value="scores.X" label="wins" value-color="text-pink-500" />
          <div :class="`text-xs font-medium py-1 px-2 rounded-lg ${isXTurn && !winner && !isDraw ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'}`">
            {{ winner === 'X' ? '🏆 Winner!' : isDraw ? 'Draw' : isXTurn ? 'Your Turn' : 'Waiting…' }}
          </div>
        </BentoCard>
        <BentoCard cls="flex-1 items-center text-center">
          <CardHeader icon="bx-radio-circle" icon-color="text-blue-500">Player O</CardHeader>
          <StatTile :value="scores.O" label="wins" value-color="text-blue-500" />
          <div :class="`text-xs font-medium py-1 px-2 rounded-lg ${!isXTurn && !winner && !isDraw ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`">
            {{ winner === 'O' ? '🏆 Winner!' : isDraw ? 'Draw' : !isXTurn ? 'Your Turn' : 'Waiting…' }}
          </div>
        </BentoCard>
      </div>

      <!-- Desktop 3-column layout -->
      <div class="hidden lg:grid grid-cols-[1fr_auto_1fr] gap-6 items-center justify-items-center">

        <!-- Player X — left -->
        <BentoCard cls="w-full items-center text-center">
          <div class="text-5xl font-black text-pink-500">X</div>
          <CardHeader icon="bx-user" icon-color="text-pink-500">Player X</CardHeader>
          <StatTile :value="scores.X" label="wins" value-color="text-pink-500" />
          <div :class="`text-xs font-medium w-full text-center py-1.5 rounded-lg ${isXTurn && !winner && !isDraw ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'}`">
            {{ winner === 'X' ? '🏆 Winner!' : isDraw ? 'Draw' : isXTurn ? '← Your Turn' : 'Waiting…' }}
          </div>
        </BentoCard>

        <!-- Board — center -->
        <BentoCard cls="items-center">
          <p class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
            {{ winner ? `${winner} wins!` : isDraw ? "It's a draw!" : `${isXTurn ? 'X' : 'O'}'s turn` }}
          </p>
          <div class="grid grid-cols-3 gap-2" style="width:300px;height:300px">
            <div v-for="(cell, i) in board" :key="i"
              @click="handleClick(i)"
              :class="`flex items-center justify-center text-4xl font-bold rounded-xl cursor-pointer transition-all select-none
                ${cell === 'X' ? 'text-pink-500' : cell === 'O' ? 'text-blue-500' : 'hover:bg-gray-200'}
                ${winCells.includes(i) ? 'bg-emerald-400 !text-white animate-pulse' : 'bg-gray-100'}`">
              {{ cell || '' }}
            </div>
          </div>
          <div class="flex gap-3 mt-2">
            <AppBtn icon="bx-refresh" @click="newGame">New Game</AppBtn>
            <AppBtn icon="bx-reset" variant="secondary" @click="resetScore">Reset Score</AppBtn>
          </div>
        </BentoCard>

        <!-- Player O — right -->
        <BentoCard cls="w-full items-center text-center">
          <div class="text-5xl font-black text-blue-500">O</div>
          <CardHeader icon="bx-user" icon-color="text-blue-500">Player O</CardHeader>
          <StatTile :value="scores.O" label="wins" value-color="text-blue-500" />
          <div :class="`text-xs font-medium w-full text-center py-1.5 rounded-lg ${!isXTurn && !winner && !isDraw ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`">
            {{ winner === 'O' ? '🏆 Winner!' : isDraw ? 'Draw' : !isXTurn ? 'Your Turn →' : 'Waiting…' }}
          </div>
        </BentoCard>
      </div>

      <!-- Mobile board -->
      <BentoCard cls="items-center lg:hidden">
        <p class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
          {{ winner ? `${winner} wins!` : isDraw ? "It's a draw!" : `${isXTurn ? 'X' : 'O'}'s turn` }}
        </p>
        <div class="grid grid-cols-3 gap-2" style="width:280px;height:280px">
          <div v-for="(cell, i) in board" :key="i"
            @click="handleClick(i)"
            :class="`flex items-center justify-center text-4xl font-bold rounded-xl cursor-pointer transition-all select-none
              ${cell === 'X' ? 'text-pink-500' : cell === 'O' ? 'text-blue-500' : 'hover:bg-gray-200'}
              ${winCells.includes(i) ? 'bg-emerald-400 !text-white animate-pulse' : 'bg-gray-100'}`">
            {{ cell || '' }}
          </div>
        </div>
        <div class="flex gap-3 mt-2">
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
