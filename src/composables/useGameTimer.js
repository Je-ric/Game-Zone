import { ref, onUnmounted } from 'vue'

export function useGameTimer(onExpire) {
  const timeLeft = ref(0)
  let interval = null

  function start(seconds) {
    stop()
    timeLeft.value = seconds
    interval = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        stop()
        onExpire?.()
      }
    }, 1000)
  }

  function stop() {
    clearInterval(interval)
    interval = null
  }

  function reset(seconds) {
    stop()
    timeLeft.value = seconds ?? 0
  }

  onUnmounted(stop)

  return { timeLeft, start, stop, reset }
}
