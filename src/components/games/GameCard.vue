<template>
  <router-link :to="game.path" class="game-card bg-white rounded-2xl p-5 flex flex-col gap-3 group"
    style="border:1px solid var(--border);box-shadow:var(--shadow-sm);text-decoration:none">
    <div class="flex items-start justify-between gap-2">
      <div :class="`w-11 h-11 rounded-xl ${game.iconBg} flex items-center justify-center text-xl shrink-0 ${game.iconColor}`">
        <i :class="`bx ${game.icon}`"></i>
      </div>
      <span class="text-[10px] font-mono mt-0.5 shrink-0" style="color:var(--text-faint)">{{ game.num }}</span>
    </div>
    <div class="flex-1 min-w-0">
      <h2 class="text-sm font-bold leading-snug transition-colors" style="color:var(--text-base)">{{ game.name }}</h2>
      <p class="text-xs mt-1 leading-relaxed line-clamp-2" style="color:var(--text-faint)">{{ game.desc }}</p>
    </div>
    <div class="flex items-center gap-1 text-xs font-bold mt-auto" style="color:var(--accent)">
      Play <i class="bx bx-right-arrow-alt text-sm"></i>
    </div>
  </router-link>
</template>

<script setup>
defineProps({ game: { type: Object, required: true } })
</script>

<style scoped>
.game-card { transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease; }
.game-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(22,163,74,0.18);
  border-color: #4ade80;
}
.game-card:hover h2 { color: #16a34a; }
</style>
