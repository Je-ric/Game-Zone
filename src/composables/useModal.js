import { ref } from 'vue'

export function useModal() {
  const visible = ref(false)
  const data = ref(null)

  function show(payload = null) {
    data.value = payload
    visible.value = true
  }

  function hide() {
    visible.value = false
    data.value = null
  }

  return { visible, data, show, hide }
}
