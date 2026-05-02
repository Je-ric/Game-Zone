import { ref } from 'vue'

export function useScore(keys = ['player', 'computer']) {
  const scores = ref(Object.fromEntries(keys.map(k => [k, 0])))

  function increment(key) {
    if (key in scores.value) scores.value[key]++
  }

  function reset() {
    Object.keys(scores.value).forEach(k => { scores.value[k] = 0 })
  }

  return { scores, increment, reset }
}
