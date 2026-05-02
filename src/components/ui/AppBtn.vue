<template>
  <button @click="$emit('click')" :type="type" :disabled="disabled"
    :class="[base, variants[variant], disabled ? 'opacity-50 cursor-not-allowed' : '', cls]">
    <i v-if="icon" :class="`bx ${icon}`"></i>
    <slot />
  </button>
</template>

<script setup>
defineEmits(['click'])
defineProps({
  variant:  { type: String, default: 'primary' },
  icon:     { type: String, default: '' },
  type:     { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  cls:      { type: String, default: '' },
})

const base = 'flex items-center justify-center gap-2 font-semibold py-2.5 px-5 rounded-xl transition-colors text-sm'

const variants = {
  primary:   'bg-indigo-500 text-white hover:bg-indigo-600',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  danger:    'bg-red-500 text-white hover:bg-red-600',
  ghost:     'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200',
  success:   'bg-emerald-500 text-white hover:bg-emerald-600',
  warning:   'bg-amber-500 text-white hover:bg-amber-600',
  outline:   'bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-50',
}
</script>
