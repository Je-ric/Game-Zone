<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

const isOnline = ref(navigator.onLine)
const installPrompt = ref(null)
const message = ref('')
const isDismissed = ref(false)
const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onRegisterError(error) {
        console.error('Offline setup failed:', error)
        message.value = 'Offline setup failed. Reopen the app online to try again.'
    },
})

function updateConnection() { isOnline.value = navigator.onLine; isDismissed.value = false }
function offerInstall(event) {
    event.preventDefault()
    installPrompt.value = event
    isDismissed.value = false
}
function clearInstall() { installPrompt.value = null }
function dismiss() {
    offlineReady.value = false
    needRefresh.value = false
    message.value = ''
    isDismissed.value = true
}
async function install() {
    const prompt = installPrompt.value
    if (!prompt) return
    clearInstall()
    try {
        await prompt.prompt()
        await prompt.userChoice
    } catch (error) {
        console.error('Installation failed:', error)
        message.value = 'Use your browser menu to install this app.'
    }
}
async function reload() {
    try {
        await updateServiceWorker(true)
    } catch (error) {
        console.error('Update failed:', error)
        message.value = 'Update failed. Check your connection and try again.'
    }
}
onMounted(() => {
    window.addEventListener('online', updateConnection)
    window.addEventListener('offline', updateConnection)
    window.addEventListener('beforeinstallprompt', offerInstall)
    window.addEventListener('appinstalled', clearInstall)
})
onUnmounted(() => {
    window.removeEventListener('online', updateConnection)
    window.removeEventListener('offline', updateConnection)
    window.removeEventListener('beforeinstallprompt', offerInstall)
    window.removeEventListener('appinstalled', clearInstall)
})
</script>

<template>
    <aside v-if="needRefresh || offlineReady || message || (!isDismissed && (!isOnline || installPrompt))" class="pwa-panel" aria-label="App availability">
        <p role="status" aria-live="polite">
            <template v-if="message">{{ message }}</template>
            <template v-else-if="needRefresh">An update is ready. Finish your work or game before reloading.</template>
            <template v-else-if="!isOnline">You’re offline. Saved app features are available; online services need a connection.</template>
            <template v-else-if="offlineReady">This app is ready to use offline.</template>
            <template v-else>Install this app for quick access from your home screen.</template>
        </p>
        <div class="pwa-actions">
            <button v-if="needRefresh" type="button" @click="reload">Reload to update</button>
            <button v-if="installPrompt" type="button" @click="install">Install app</button>
            <button type="button" @click="dismiss">{{ needRefresh ? 'Later' : 'Dismiss' }}</button>
        </div>
    </aside>
</template>

<style scoped>
.pwa-panel { position: fixed; z-index: 1000; right: 1rem; bottom: max(1rem, env(safe-area-inset-bottom)); width: min(24rem, calc(100vw - 2rem)); padding: 1rem; color: #14532d; background: #fff; border: 1px solid #86efac; border-radius: 1rem; box-shadow: 0 8px 32px #052e1626; font-size: .875rem; }
.pwa-panel p { margin: 0; }
.pwa-actions { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .75rem; }
.pwa-actions:empty { display: none; }
.pwa-actions button { padding: .5rem .75rem; border: 1px solid #15803d; border-radius: .5rem; background: #f0fdf4; color: #14532d; cursor: pointer; }
.pwa-actions button:hover { background: #dcfce7; }
.pwa-actions button:focus-visible { outline: 2px solid #15803d; outline-offset: 3px; }
</style>
