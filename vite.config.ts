// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This tells Vite to proxy any request that starts with /api
      '/api': {
        // This is the real server we want to send the request to
        target: 'https://itunes.apple.com',
        // This is necessary for the target server to accept the request
        changeOrigin: true,
        // This removes the '/api' prefix before sending the request
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})