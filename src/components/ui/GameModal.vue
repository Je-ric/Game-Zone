<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="visible" class="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full relative overflow-hidden">
          <div :class="`absolute top-0 left-0 w-full h-1.5 ${accentClass}`"></div>
          <div class="p-8 text-center flex flex-col gap-4">
            <div class="text-5xl">{{ emoji }}</div>
            <h2 class="text-2xl font-bold text-gray-800">{{ title }}</h2>
            <p class="text-gray-500">{{ message }}</p>
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineProps({
  visible:     { type: Boolean, default: false },
  title:       { type: String, default: 'Game Over!' },
  message:     { type: String, default: '' },
  emoji:       { type: String, default: '🎮' },
  accentClass: { type: String, default: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
