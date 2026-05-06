<template>
  <div class="min-h-screen flex flex-col" style="background:var(--bg-page)">

    <!-- Top bar -->
    <div class="bg-white border-b px-4 sm:px-6 py-3 flex items-center gap-3 sticky top-0 z-50"
      style="border-color:var(--border);box-shadow:var(--shadow-sm)">
      <router-link to="/" class="inline-flex items-center gap-1.5 text-sm font-medium transition-colors shrink-0"
        style="color:var(--text-muted)"
        onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-muted)'">
        <i class="bx bx-arrow-back"></i>
        <span class="hidden sm:inline">Back</span>
      </router-link>
      <div class="w-px h-5" style="background:var(--border)"></div>
      <div class="min-w-0 flex-1">
        <h1 class="text-base font-bold leading-tight truncate" style="color:var(--text-base)">{{ title }}</h1>
        <p v-if="subtitle" class="text-xs truncate hidden sm:block" style="color:var(--text-muted)">{{ subtitle }}</p>
      </div>
      <!-- How to Play button -->
      <button v-if="$slots.howtoplay" @click="showHtp = true"
        class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 transition-all"
        style="background:var(--gh-100);color:var(--gh-700);border:1px solid var(--gh-200)"
        onmouseover="this.style.background='var(--gh-200)'" onmouseout="this.style.background='var(--gh-100)'">
        <i class="bx bx-help-circle text-sm"></i>
        How to Play
      </button>
    </div>

    <!-- Body -->
    <div class="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">
      <slot />
    </div>

    <!-- How to Play Modal -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="showHtp" class="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          @click.self="showHtp = false">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
            <div class="h-1.5 w-full" style="background:linear-gradient(90deg,#15803d,#22c55e)"></div>
            <div class="p-7 flex flex-col gap-5">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold" style="color:var(--text-base)">
                  <i class="bx bx-joystick mr-1.5" style="color:var(--accent)"></i> How to Play
                </h2>
                <button @click="showHtp = false" class="text-gray-400 hover:text-gray-600 transition-colors">
                  <i class="bx bx-x text-2xl"></i>
                </button>
              </div>
              <div class="text-base leading-relaxed overflow-y-auto max-h-[60vh]" style="color:var(--text-muted)">
                <slot name="howtoplay" />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ title: String, subtitle: String })
const showHtp = ref(false)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
