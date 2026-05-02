<template>
  <div :class="`bg-white rounded-2xl shadow p-${padding} flex flex-col gap-${gap} ${cls}`">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  padding: { type: String, default: '5' },
  gap:     { type: String, default: '4' },
  cls:     { type: String, default: '' },
})
</script>
