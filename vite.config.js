import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: 'prompt',
            includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
            manifest: {
                id: './',
                name: 'GameZone',
                short_name: 'GameZone',
                description: 'Play a collection of browser games offline.',
                lang: 'en',
                start_url: './',
                scope: './',
                display: 'standalone',
                theme_color: '#15803d',
                background_color: '#f0fdf4',
                icons: [
                    { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
                    { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                    { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                ],
            },
            workbox: {
                cacheId: 'gamezone',
                globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2,mp3,wav,webp}'],
                navigateFallback: 'index.html',
                cleanupOutdatedCaches: true,
            },
        }),
    ],
})
