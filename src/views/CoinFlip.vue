<template>
  <GameLayout title="Coin Flip Challenge" subtitle="Test your luck and prediction skills!">
    <template #howtoplay>
      <ol class="list-decimal list-inside space-y-2">
        <li>Choose a game mode: <strong>Single Coin</strong> (one flip) or <strong>Double Coin</strong> (two flips).</li>
        <li>Each player picks their bet — <strong>Heads</strong> or <strong>Tails</strong> — before each flip.</li>
        <li>Click <em>Flip Coins</em> to flip. Players who guessed correctly earn a point.</li>
        <li>First player to reach <strong>5 points</strong> wins the game.</li>
        <li>Click <em>New Game</em> to return to mode selection and reset scores.</li>
      </ol>
    </template>

    <div class="w-full flex flex-col gap-5">

      <!-- Setup screen -->
      <template v-if="!gameStarted">
        <BentoCard cls="items-center">
          <CardHeader icon="bx-game">Select Game Mode</CardHeader>
          <div class="flex justify-center gap-5 flex-wrap">
            <div v-for="mode in COIN_MODES" :key="mode.value"
              @click="selectedMode = mode.value"
              :class="`cursor-pointer border-2 rounded-xl p-5 w-44 text-center transition-all hover:-translate-y-1 hover:shadow-md
                ${selectedMode === mode.value ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-gray-50'}`">
              <div class="text-4xl mb-2">{{ mode.icon }}</div>
              <div class="font-semibold text-gray-800 text-sm">{{ mode.label }}</div>
              <div class="text-xs text-gray-400 mt-1">{{ mode.desc }}</div>
            </div>
          </div>
          <AppBtn @click="startGame" :disabled="!selectedMode" icon="bx-play" cls="self-center px-10">Start Game</AppBtn>
        </BentoCard>
      </template>

      <!-- Game screen -->
      <template v-else>

        <!-- Mobile: stacked -->
        <div class="flex lg:hidden flex-col gap-4">
          <div class="grid grid-cols-2 gap-4">
            <BentoCard v-for="(p, i) in players" :key="i" :cls="p.winner ? 'ring-2 ring-emerald-400' : ''" cls="items-center text-center">
              <div :class="`h-1 -mt-5 -mx-5 mb-2 rounded-t-2xl ${i === 0 ? 'bg-indigo-400' : 'bg-pink-400'}`"></div>
              <input v-model="p.name" class="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center outline-none focus:border-indigo-400" />
              <StatTile :value="p.score" label="score" :value-color="i === 0 ? 'text-indigo-500' : 'text-pink-500'" />
              <RadioGroup :options="betOptions" v-model="p.bet" :name="`player${i}Bet`" grid-cols="grid-cols-1" />
            </BentoCard>
          </div>
          <BentoCard cls="items-center">
            <CardHeader icon="bx-coin">Flip Result</CardHeader>
            <div class="flex justify-center gap-10 my-4">
              <div v-for="(_, i) in coinResults" :key="i" :class="`coin ${coinAnim[i]}`">
                <div class="coin-side heads">👑</div>
                <div class="coin-side tails">⚜️</div>
              </div>
            </div>
            <p class="font-semibold text-gray-700 text-center min-h-6">{{ resultMsg }}</p>
            <p class="text-gray-400 text-sm text-center min-h-5">{{ resultDetail }}</p>
            <div class="flex gap-3 justify-center">
              <AppBtn @click="flipCoins" :disabled="isFlipping || gameOver" icon="bx-coin">Flip Coins</AppBtn>
              <AppBtn variant="ghost" @click="resetGame" icon="bx-refresh">New Game</AppBtn>
            </div>
          </BentoCard>
        </div>

        <!-- Desktop: Player 1 | Coin | Player 2 -->
        <div class="hidden lg:grid grid-cols-[220px_1fr_220px] gap-6 items-center">

          <!-- Player 1 — left -->
          <BentoCard :cls="players[0].winner ? 'ring-2 ring-emerald-400 items-center text-center' : 'items-center text-center'">
            <div class="h-1 -mt-5 -mx-5 mb-2 rounded-t-2xl bg-indigo-400"></div>
            <input v-model="players[0].name" class="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center outline-none focus:border-indigo-400" />
            <StatTile :value="players[0].score" label="score" value-color="text-indigo-500" />
            <RadioGroup :options="betOptions" v-model="players[0].bet" name="player0Bet" grid-cols="grid-cols-1" />
            <div v-if="players[0].winner" class="text-emerald-600 font-bold text-sm">🏆 Winner!</div>
          </BentoCard>

          <!-- Coin — center -->
          <BentoCard cls="items-center">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                First to {{ targetScore }} pts
              </span>
              <span class="text-xs font-bold px-2 py-1 rounded-full bg-indigo-50 text-indigo-500">
                {{ selectedMode === 'single' ? 'Single Coin' : 'Double Coin' }}
              </span>
            </div>
            <CardHeader icon="bx-coin">Flip Result</CardHeader>
            <div class="flex justify-center gap-10 my-4">
              <div v-for="(_, i) in coinResults" :key="i" :class="`coin ${coinAnim[i]}`">
                <div class="coin-side heads">👑</div>
                <div class="coin-side tails">⚜️</div>
              </div>
            </div>
            <p class="font-semibold text-gray-700 text-center min-h-6">{{ resultMsg }}</p>
            <p class="text-gray-400 text-sm text-center min-h-5">{{ resultDetail }}</p>
            <div class="flex gap-3 justify-center mt-2">
              <AppBtn @click="flipCoins" :disabled="isFlipping || gameOver" icon="bx-coin">Flip Coins</AppBtn>
              <AppBtn variant="ghost" @click="resetGame" icon="bx-refresh">New Game</AppBtn>
            </div>
          </BentoCard>

          <!-- Player 2 — right -->
          <BentoCard :cls="players[1].winner ? 'ring-2 ring-emerald-400 items-center text-center' : 'items-center text-center'">
            <div class="h-1 -mt-5 -mx-5 mb-2 rounded-t-2xl bg-pink-400"></div>
            <input v-model="players[1].name" class="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center outline-none focus:border-pink-400" />
            <StatTile :value="players[1].score" label="score" value-color="text-pink-500" />
            <RadioGroup :options="betOptions" v-model="players[1].bet" name="player1Bet" grid-cols="grid-cols-1" />
            <div v-if="players[1].winner" class="text-emerald-600 font-bold text-sm">🏆 Winner!</div>
          </BentoCard>
        </div>

      </template>
    </div>
  </GameLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import GameLayout  from '../components/layouts/GameLayout.vue'
import BentoCard   from '../components/ui/BentoCard.vue'
import CardHeader  from '../components/ui/CardHeader.vue'
import StatTile    from '../components/ui/StatTile.vue'
import AppBtn      from '../components/ui/AppBtn.vue'
import RadioGroup  from '../components/ui/RadioGroup.vue'
import { COIN_MODES, BET_OPTIONS, flipCoin, resolveOutcome } from '../utils/coinFlip.js'

const targetScore = 5
const selectedMode = ref('')
const gameStarted = ref(false)
const isFlipping = ref(false)
const gameOver = ref(false)
const resultMsg = ref('')
const resultDetail = ref('')
const coinResults = ref([])
const coinAnim = ref([])

const players = ref([
  { name: 'Player 1', score: 0, bet: 'heads', winner: false },
  { name: 'Player 2', score: 0, bet: 'tails', winner: false },
])

const betOptions = computed(() => BET_OPTIONS[selectedMode.value] ?? [])

function startGame() {
  if (!selectedMode.value) return
  coinResults.value = selectedMode.value === 'single' ? [null] : [null, null]
  coinAnim.value = coinResults.value.map(() => '')
  players.value.forEach(p => { p.score = 0; p.winner = false })
  gameOver.value = false; resultMsg.value = ''; resultDetail.value = ''
  gameStarted.value = true
}

function flipCoins() {
  if (isFlipping.value || gameOver.value) return
  isFlipping.value = true; resultMsg.value = 'Flipping...'; resultDetail.value = ''
  coinAnim.value = coinAnim.value.map(() => '')
  setTimeout(() => {
    const results = coinResults.value.map(() => flipCoin())
    coinAnim.value = results.map(r => r === 'heads' ? 'flip' : 'flip-tails')
    setTimeout(() => { coinResults.value = results; checkResults(results); isFlipping.value = false }, 1600)
  }, 50)
}

function checkResults(results) {
  const { outcome, detail } = resolveOutcome(results)
  resultDetail.value = detail
  const c1 = players.value[0].bet === outcome
  const c2 = players.value[1].bet === outcome
  if (c1) players.value[0].score++
  if (c2) players.value[1].score++
  if (c1 && c2) resultMsg.value = 'Both players guessed correctly!'
  else if (c1)  resultMsg.value = `${players.value[0].name} guessed correctly!`
  else if (c2)  resultMsg.value = `${players.value[1].name} guessed correctly!`
  else          resultMsg.value = 'No one guessed correctly!'
  if (players.value[0].score >= targetScore) { resultMsg.value = `${players.value[0].name} wins!`; players.value[0].winner = true; gameOver.value = true }
  else if (players.value[1].score >= targetScore) { resultMsg.value = `${players.value[1].name} wins!`; players.value[1].winner = true; gameOver.value = true }
}

function resetGame() {
  gameStarted.value = false; selectedMode.value = ''
  players.value.forEach(p => { p.score = 0; p.winner = false; p.bet = '' })
  resultMsg.value = ''; resultDetail.value = ''; gameOver.value = false
}
</script>

<style scoped>
.coin { width: 90px; height: 90px; position: relative; transform-style: preserve-3d; }
.coin.flip       { animation: coinFlip 1.5s ease-out forwards; }
.coin.flip-tails { animation: coinFlipTails 1.5s ease-out forwards; }
@keyframes coinFlip      { 0% { transform: rotateY(0); } 100% { transform: rotateY(1800deg); } }
@keyframes coinFlipTails { 0% { transform: rotateY(0); } 100% { transform: rotateY(1980deg); } }
.coin-side {
  position: absolute; width: 100%; height: 100%;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 2.2rem; backface-visibility: hidden;
}
.heads { background: linear-gradient(135deg, #ffd700, #ffb700); box-shadow: inset 0 0 10px rgba(0,0,0,.2); z-index: 2; }
.tails { background: linear-gradient(135deg, #c0c0c0, #a0a0a0); box-shadow: inset 0 0 10px rgba(0,0,0,.2); transform: rotateY(180deg); }
</style>
