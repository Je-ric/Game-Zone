<template>
  <div class="bg-[#f8fafc] min-h-screen flex flex-col items-center justify-start p-6 gap-6">
    <div :class="`w-full ${maxW}`">
      <router-link to="/" class="inline-flex items-center gap-1 text-gray-400 hover:text-indigo-500 text-sm transition-colors">
        <i class="bx bx-arrow-back"></i> Back to Game Zone
      </router-link>
    </div>
    <div :class="`w-full ${maxW}`">
      <h1 class="text-4xl font-bold text-gray-800">{{ title }}</h1>
      <p class="text-gray-400 font-light mt-1">{{ subtitle }}</p>
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title:    String,
  subtitle: String,
  maxW:     { type: String, default: 'max-w-5xl' },
})
</script>
