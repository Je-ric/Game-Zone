<template>
  <div class="bg-[#f8fafc] min-h-screen p-6 md:p-10">
    <div class="max-w-6xl mx-auto mb-10 text-center">
      <p class="text-indigo-500 font-medium tracking-widest text-sm uppercase mb-2">Vue Frontend</p>
      <h1 class="text-5xl font-bold text-gray-800">
        <i class="bx bx-game text-indigo-500"></i> Game Zone
      </h1>
      <p class="text-gray-400 mt-2 text-lg font-light">A collection of interactive mini-games built with Vue & Tailwind</p>
    </div>

    <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <GameCard v-for="game in games" :key="game.path" :game="game" />
    </div>

    <p class="text-center text-gray-400 text-sm mt-12 font-light">
      Game Zone — {{ games.length }} games · by
      <a href="https://github.com/Je-ric" class="text-indigo-400 hover:text-indigo-600 transition-colors">@Je-ric (Hiro)</a>
    </p>
  </div>
</template>

<script setup>
import { games } from '../data/games.js'
import GameCard from '../components/games/GameCard.vue'
</script>
