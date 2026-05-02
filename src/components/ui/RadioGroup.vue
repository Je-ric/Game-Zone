<template>
  <div :class="`grid gap-2 ${gridCols}`">
    <label v-for="opt in options" :key="opt.value" class="cursor-pointer">
      <input type="radio" :name="name" :value="opt.value" :checked="modelValue === opt.value"
        @change="$emit('update:modelValue', opt.value)" class="sr-only" />
      <div :class="`flex items-center justify-center py-2.5 px-3 rounded-xl font-medium text-sm transition-all
        ${modelValue === opt.value ? activeClass : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`">
        <span v-if="opt.icon" class="mr-1.5">{{ opt.icon }}</span>
        {{ opt.label }}
      </div>
    </label>
  </div>
</template>

<script setup>
defineEmits(['update:modelValue'])
defineProps({
  options:     { type: Array, required: true },
  modelValue:  { type: [String, Number], default: null },
  name:        { type: String, default: 'radio' },
  gridCols:    { type: String, default: 'grid-cols-2' },
  activeClass: { type: String, default: 'bg-indigo-400 text-white shadow' },
})
</script>
