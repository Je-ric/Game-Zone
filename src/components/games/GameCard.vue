<template>
  <router-link :to="game.path" class="game-card bg-white rounded-2xl shadow p-5 flex flex-col gap-3 group">
    <div :class="`w-12 h-12 rounded-xl ${game.iconBg} flex items-center justify-center text-white text-2xl`">
      <i :class="`bx ${game.icon}`"></i>
    </div>
    <div>
      <p class="text-xs text-gray-400 uppercase tracking-widest">{{ game.num }}</p>
      <h2 class="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{{ game.name }}</h2>
      <p class="text-sm text-gray-400 font-light mt-1">{{ game.desc }}</p>
    </div>
    <div class="mt-auto flex items-center gap-1 text-indigo-500 text-sm font-medium">
      Play <i class="bx bx-right-arrow-alt"></i>
    </div>
  </router-link>
</template>

<script setup>
defineProps({ game: { type: Object, required: true } })
</script>

<style scoped>
.game-card { transition: transform 0.2s, box-shadow 0.2s; }
.game-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
</style>
