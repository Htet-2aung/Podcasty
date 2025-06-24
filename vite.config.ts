// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      },
      manifest: {
        name: 'Podcasty',
        short_name: 'Podcasty',
        description: 'A Modern Podcast Discovery Platform',
        theme_color: '#4f46e5', // Main theme color from your CSS
        background_color: '#111827', // Dark mode background from your CSS
        display: 'standalone',
        scope: '/',
        start_url: '/',
        
        // --- FIXES APPLIED BELOW ---

        id: '/', // Fix: Added unique ID
        orientation: 'portrait-primary', // Fix: Added orientation
        launch_handler: { // Fix: Added launch handler
          client_mode: ['navigate-existing', 'auto']
        },
        icons: [
          // Fix: Clearly separated 'any' and 'maskable' icons
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any' 
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png', // Note: Use a dedicated maskable icon
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        // Fix: Added screenshots array
        screenshots: [
          {
            src: 'screenshot-1.jpg', // You need to create this file
            sizes: '1080x1920',
            type: 'image/jpeg',
            form_factor: 'narrow',
            label: 'App Home Screen'
          },
          {
            src: 'screenshot-2.jpg', // You need to create this file
            sizes: '1080x1920',
            type: 'image/jpeg',
            form_factor: 'narrow',
            label: 'Podcast Player'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
