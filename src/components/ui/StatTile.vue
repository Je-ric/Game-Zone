<template>
  <div :class="`bg-gray-50 rounded-xl p-3 text-center ${cls}`">
    <p :class="`font-bold ${valueColor} ${large ? 'text-3xl' : 'text-xl'}`">{{ value }}</p>
    <p class="text-xs text-gray-500 mt-1">{{ label }}</p>
  </div>
</template>

<script setup>
defineProps({
  value:      { type: [String, Number], required: true },
  label:      { type: String, required: true },
  valueColor: { type: String, default: 'text-indigo-600' },
  large:      { type: Boolean, default: true },
  cls:        { type: String, default: '' },
})
</script>
