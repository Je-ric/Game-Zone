<template>
  <GameLayout title="Rock Paper Scissors" subtitle="Choose your weapon and challenge the computer!" max-w="max-w-4xl">
    <div class="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Game Area -->
      <div class="lg:col-span-2 flex flex-col gap-5">

        <!-- Scores -->
        <div class="grid grid-cols-2 gap-5">
          <BentoCard>
            <CardHeader icon="bx-user" icon-color="text-indigo-500">{{ playerName }}</CardHeader>
            <StatTile :value="scores.player" label="wins" value-color="text-indigo-600" />
          </BentoCard>
          <BentoCard>
            <CardHeader icon="bx-bot" icon-color="text-pink-500">Computer</CardHeader>
            <StatTile :value="scores.computer" label="wins" value-color="text-pink-500" />
          </BentoCard>
        </div>

        <BentoCard>
          <CardHeader icon="bx-edit">Player Name</CardHeader>
          <div class="flex gap-2">
            <input v-model="playerName" class="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-indigo-600 outline-none focus:border-indigo-400 bg-gray-50" />
          </div>
        </BentoCard>

        <!-- Choices display -->
        <BentoCard>
          <CardHeader icon="bx-game">Arena</CardHeader>
          <div class="flex justify-between items-center px-4">
            <div class="flex flex-col items-center gap-2">
              <div class="w-20 h-20 flex items-center justify-center bg-gray-50 rounded-xl shadow text-4xl text-indigo-600">
                <i v-if="playerChoice" :class="`fas ${CHOICE_META[playerChoice].icon}`"></i>
                <i v-else class="fas fa-question text-gray-300"></i>
              </div>
              <p class="text-xs text-gray-400">Your Choice</p>
            </div>
            <div class="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-indigo-400 to-pink-400 text-white font-bold rounded-full shadow text-xs">VS</div>
            <div class="flex flex-col items-center gap-2">
              <div class="w-20 h-20 flex items-center justify-center bg-gray-50 rounded-xl shadow text-4xl text-pink-500">
                <i v-if="computerChoice" :class="`fas ${CHOICE_META[computerChoice].icon}`"></i>
                <i v-else class="fas fa-question text-gray-300"></i>
              </div>
              <p class="text-xs text-gray-400">Computer</p>
            </div>
          </div>

          <div class="text-center min-h-8 flex items-center justify-center">
            <p :class="`text-lg font-bold ${resultClass}`">{{ resultText }}</p>
          </div>

          <!-- Choice buttons -->
          <div class="flex justify-center gap-5">
            <button v-for="c in CHOICES" :key="c" @click="play(c)"
              :class="`w-16 h-16 rounded-full text-white text-2xl flex items-center justify-center shadow-md hover:-translate-y-1 transition-transform ${CHOICE_META[c].bg}`">
              <i :class="`fas ${CHOICE_META[c].icon}`"></i>
            </button>
          </div>

          <AppBtn variant="danger" icon="bx-reset" cls="w-full justify-center" @click="reset">Reset Game</AppBtn>
        </BentoCard>
      </div>

      <!-- History -->
      <BentoCard cls="overflow-hidden">
        <CardHeader icon="bx-history">History</CardHeader>
        <div class="flex flex-col gap-2 overflow-y-auto max-h-96">
          <div v-if="!history.length" class="text-sm text-gray-400 text-center py-4">No games yet</div>
          <div v-for="(h, i) in history" :key="i"
            :class="`flex justify-between items-center px-3 py-2 bg-gray-50 rounded-xl border-l-4
              ${h.result === 'player' ? 'border-emerald-400' : h.result === 'computer' ? 'border-red-400' : 'border-amber-400'}`">
            <div class="flex items-center gap-2 text-indigo-600 text-sm">
              <i :class="`fas ${CHOICE_META[h.player].icon}`"></i>
              <span class="text-gray-300 text-xs">vs</span>
              <i :class="`fas ${CHOICE_META[h.computer].icon} text-pink-500`"></i>
            </div>
            <span :class="`text-xs font-bold ${h.result === 'player' ? 'text-emerald-500' : h.result === 'computer' ? 'text-red-500' : 'text-amber-500'}`">
              {{ h.result === 'player' ? 'Win' : h.result === 'computer' ? 'Loss' : 'Tie' }}
            </span>
          </div>
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
import { CHOICES, CHOICE_META, getComputerChoice, determineWinner } from '../utils/rockPaperScissors.js'

const playerName    = ref('Player 1')
const playerChoice  = ref('')
const computerChoice = ref('')
const resultText    = ref('Choose your weapon!')
const resultClass   = ref('text-gray-400')
const history       = ref([])
const { scores, increment, reset: resetScores } = useScore(['player', 'computer'])

function play(choice) {
  const comp = getComputerChoice()
  playerChoice.value = choice; computerChoice.value = comp
  const result = determineWinner(choice, comp)

  if (result === 'player')   { increment('player');   resultText.value = `${playerName.value} wins!`; resultClass.value = 'text-emerald-600' }
  else if (result === 'computer') { increment('computer'); resultText.value = 'Computer wins!';        resultClass.value = 'text-red-600' }
  else                            {                        resultText.value = "It's a tie!";           resultClass.value = 'text-amber-600' }

  history.value.unshift({ player: choice, computer: comp, result })
  if (history.value.length > 10) history.value.pop()
}

function reset() {
  resetScores()
  playerChoice.value = ''; computerChoice.value = ''
  resultText.value = 'Choose your weapon!'; resultClass.value = 'text-gray-400'
  history.value = []
}
</script>
