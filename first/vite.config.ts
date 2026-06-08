import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        // Allow long-running Gemini SSE responses (3 minutes)
        proxyTimeout: 180000,
        timeout: 180000,
      },
    },
  },
})
