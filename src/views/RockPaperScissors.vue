<template>
  <GameLayout title="Rock Paper Scissors" subtitle="Choose your weapon and challenge the computer!">
    <template #howtoplay>
      <ol class="list-decimal list-inside space-y-2">
        <li>Click one of the three buttons: <strong>Rock ✊</strong>, <strong>Paper ✋</strong>, or <strong>Scissors ✌️</strong>.</li>
        <li>The computer picks randomly at the same time.</li>
        <li><strong>Rock</strong> beats Scissors • <strong>Scissors</strong> beats Paper • <strong>Paper</strong> beats Rock.</li>
        <li>If both pick the same, it's a <strong>tie</strong> — no points awarded.</li>
        <li>Your game history is shown on the right. Click <em>Reset Game</em> to clear scores.</li>
      </ol>
    </template>

    <!-- Desktop: Player | Arena | History — Mobile: stacked -->
    <div class="w-full grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-5 items-start">

      <!-- Player — left -->
      <div class="flex flex-col gap-4">
        <BentoCard cls="items-center text-center">
          <CardHeader icon="bx-user" icon-color="text-indigo-500">You</CardHeader>
          <input v-model="playerName" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-center text-indigo-600 outline-none focus:border-indigo-400 bg-gray-50" />
          <StatTile :value="scores.player" label="wins" value-color="text-indigo-600" />
        </BentoCard>
        <!-- Mobile choice buttons -->
        <BentoCard cls="lg:hidden items-center">
          <CardHeader icon="bx-game">Choose</CardHeader>
          <div class="flex justify-center gap-4">
            <button v-for="c in CHOICES" :key="c" @click="play(c)"
              :class="`w-14 h-14 rounded-full text-white text-xl flex items-center justify-center shadow-md hover:-translate-y-1 transition-transform ${CHOICE_META[c].bg}`">
              <i :class="`fas ${CHOICE_META[c].icon}`"></i>
            </button>
          </div>
        </BentoCard>
      </div>

      <!-- Arena — center -->
      <BentoCard cls="items-center">
        <CardHeader icon="bx-game">Arena</CardHeader>

        <!-- Choices display -->
        <div class="flex justify-between items-center w-full px-4 py-2">
          <div class="flex flex-col items-center gap-2">
            <div class="w-20 h-20 flex items-center justify-center bg-gray-50 rounded-xl shadow text-4xl text-indigo-600">
              <i v-if="playerChoice" :class="`fas ${CHOICE_META[playerChoice].icon}`"></i>
              <i v-else class="fas fa-question text-gray-300"></i>
            </div>
            <p class="text-xs text-gray-400 font-medium">{{ playerName }}</p>
          </div>
          <div class="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-indigo-400 to-pink-400 text-white font-bold rounded-full shadow text-xs shrink-0">VS</div>
          <div class="flex flex-col items-center gap-2">
            <div class="w-20 h-20 flex items-center justify-center bg-gray-50 rounded-xl shadow text-4xl text-pink-500">
              <i v-if="computerChoice" :class="`fas ${CHOICE_META[computerChoice].icon}`"></i>
              <i v-else class="fas fa-question text-gray-300"></i>
            </div>
            <p class="text-xs text-gray-400 font-medium">Computer</p>
          </div>
        </div>

        <div class="text-center min-h-8 flex items-center justify-center">
          <p :class="`text-lg font-bold ${resultClass}`">{{ resultText }}</p>
        </div>

        <!-- Choice buttons — desktop only -->
        <div class="hidden lg:flex justify-center gap-5">
          <button v-for="c in CHOICES" :key="c" @click="play(c)"
            :class="`w-16 h-16 rounded-full text-white text-2xl flex items-center justify-center shadow-md hover:-translate-y-1 transition-transform ${CHOICE_META[c].bg}`">
            <i :class="`fas ${CHOICE_META[c].icon}`"></i>
          </button>
        </div>

        <AppBtn variant="danger" icon="bx-reset" cls="w-full justify-center mt-2" @click="reset">Reset Game</AppBtn>
      </BentoCard>

      <!-- Computer + History — right -->
      <div class="flex flex-col gap-4">
        <BentoCard cls="items-center text-center">
          <CardHeader icon="bx-bot" icon-color="text-pink-500">Computer</CardHeader>
          <StatTile :value="scores.computer" label="wins" value-color="text-pink-500" />
        </BentoCard>
        <BentoCard cls="overflow-hidden">
          <CardHeader icon="bx-history">History</CardHeader>
          <div class="flex flex-col gap-2 overflow-y-auto max-h-64">
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

const playerName     = ref('Player 1')
const playerChoice   = ref('')
const computerChoice = ref('')
const resultText     = ref('Choose your weapon!')
const resultClass    = ref('text-gray-400')
const history        = ref([])
const { scores, increment, reset: resetScores } = useScore(['player', 'computer'])

function play(choice) {
  const comp = getComputerChoice()
  playerChoice.value = choice; computerChoice.value = comp
  const result = determineWinner(choice, comp)
  if (result === 'player')        { increment('player');   resultText.value = `${playerName.value} wins!`; resultClass.value = 'text-emerald-600' }
  else if (result === 'computer') { increment('computer'); resultText.value = 'Computer wins!';            resultClass.value = 'text-red-600' }
  else                            {                        resultText.value = "It's a tie!";               resultClass.value = 'text-amber-600' }
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
