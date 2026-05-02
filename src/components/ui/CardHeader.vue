<template>
  <h2 class="text-lg font-semibold text-gray-700 flex items-center gap-2">
    <i v-if="icon" :class="`bx ${icon} ${iconColor}`"></i>
    <slot />
  </h2>
</template>

<script setup>
defineProps({
  icon:      { type: String, default: '' },
  iconColor: { type: String, default: 'text-indigo-500' },
})
</script>
