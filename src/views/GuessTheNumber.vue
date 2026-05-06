<template>
  <GameLayout title="Guess the Number" subtitle="Guess the secret number within limited attempts.">
    <template #howtoplay>
      <ol class="list-decimal list-inside space-y-2">
        <li>Select a <strong>number range</strong> (e.g. 1–100) and a <strong>guess limit</strong> (e.g. 7 guesses).</li>
        <li>Click <em>Start Game</em>. A secret number is randomly chosen within your range.</li>
        <li>Type a number and click <em>Submit Guess</em> or press <strong>Enter</strong>.</li>
        <li>You'll get a hint: <strong>📉 Too low</strong> or <strong>📈 Too high</strong> after each wrong guess.</li>
        <li>Guess correctly before running out of attempts to win. Run out — the number is revealed.</li>
      </ol>
    </template>
    <div class="w-full flex justify-center">
    <div class="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-5">

      <!-- Settings -->
      <div class="flex flex-col gap-5">
        <BentoCard>
          <CardHeader icon="bx-slider">Number Range</CardHeader>
          <RadioGroup :options="ranges" v-model="selectedRange" name="range" grid-cols="grid-cols-2" />
        </BentoCard>
        <BentoCard>
          <CardHeader icon="bx-hash">Number of Guesses</CardHeader>
          <RadioGroup :options="attempts" v-model="selectedAttempt" name="attempt" grid-cols="grid-cols-2" />
        </BentoCard>
        <AppBtn @click="startGame" icon="bx-play" cls="w-full justify-center">Start Game</AppBtn>
      </div>

      <!-- Game card -->
      <BentoCard cls="relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-orange-400"></div>
        <CardHeader icon="bx-game">Game</CardHeader>

        <div v-if="!gameActive" class="text-center text-gray-400 py-8 text-sm">
          Select range & guesses, then start!
        </div>

        <template v-else>
          <input
            v-model.number="userGuess"
            type="number"
            placeholder="Enter your guess"
            @keydown.enter="checkGuess"
            class="w-full px-4 py-3 text-xl text-center border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-gray-50"
          />
          <AppBtn @click="checkGuess" icon="bx-check" cls="w-full justify-center" variant="warning">Submit Guess</AppBtn>

          <div v-if="feedback" class="text-lg font-semibold text-center py-2 bg-gray-50 rounded-xl text-gray-700">{{ feedback }}</div>
          <div v-if="guessList.length" class="text-sm text-gray-400 bg-gray-50 rounded-xl px-3 py-2 text-center">
            Your guesses: {{ guessList.join(', ') }}
          </div>
          <StatTile :value="guessesLeft" label="guesses remaining" value-color="text-indigo-600" :large="false" />
        </template>
      </BentoCard>

    </div>
    </div>

    <GameModal
      :visible="winModal.visible.value"
      title="You got it!"
      message="Great job guessing the number."
      emoji="🎉"
      accent-class="bg-gradient-to-r from-emerald-400 to-indigo-500"
    >
      <AppBtn @click="resetGame" icon="bx-refresh" variant="success" cls="w-full justify-center">Play Again</AppBtn>
    </GameModal>

    <GameModal
      :visible="loseModal.visible.value"
      :title="`Game Over!`"
      :message="`The correct number was ${secretNumber}.`"
      emoji="💥"
      accent-class="bg-gradient-to-r from-red-400 to-amber-400"
    >
      <AppBtn @click="resetGame" icon="bx-refresh" variant="danger" cls="w-full justify-center">Try Again</AppBtn>
    </GameModal>
  </GameLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import GameLayout from '../components/layouts/GameLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import StatTile   from '../components/ui/StatTile.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import RadioGroup from '../components/ui/RadioGroup.vue'
import GameModal  from '../components/ui/GameModal.vue'
import { useModal } from '../composables/useModal.js'

const ranges   = [{ value: 10, label: '1–10' }, { value: 30, label: '1–30' }, { value: 50, label: '10–50' }, { value: 100, label: '1–100' }]
const attempts = [{ value: 3, label: '3 guesses' }, { value: 5, label: '5 guesses' }, { value: 7, label: '7 guesses' }, { value: 10, label: '10 guesses' }]

const selectedRange   = ref(null)
const selectedAttempt = ref(null)
const gameActive  = ref(false)
const secretNumber = ref(0)
const userGuess   = ref('')
const feedback    = ref('')
const guessList   = ref([])
const guessCount  = ref(0)
const winModal  = useModal()
const loseModal = useModal()

const guessesLeft = computed(() => (selectedAttempt.value ?? 0) - guessCount.value)

function startGame() {
  if (!selectedRange.value || !selectedAttempt.value) { alert('Select both range and guesses.'); return }
  secretNumber.value = Math.floor(Math.random() * selectedRange.value) + 1
  guessCount.value = 0; guessList.value = []; feedback.value = ''; userGuess.value = ''
  gameActive.value = true
}

function checkGuess() {
  if (userGuess.value === '' || userGuess.value === null) { alert('Please enter a valid number.'); return }
  const g = parseInt(userGuess.value)
  guessCount.value++; guessList.value.push(g); userGuess.value = ''

  if (g === secretNumber.value)                        { winModal.show() }
  else if (guessCount.value >= selectedAttempt.value)  { loseModal.show(); gameActive.value = false }
  else if (g < secretNumber.value)                     { feedback.value = '📉 Too low!' }
  else                                                  { feedback.value = '📈 Too high!' }
}

function resetGame() {
  winModal.hide(); loseModal.hide()
  gameActive.value = false; selectedRange.value = null; selectedAttempt.value = null
  guessList.value = []; feedback.value = ''
}
</script>
