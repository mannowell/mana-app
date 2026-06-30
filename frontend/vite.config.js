import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/conversations': {
        target: 'http://localhost:8098',
        changeOrigin: true,
      },
      '/api/settings': {
        target: 'http://localhost:8098',
        changeOrigin: true,
      },
      '/api/stats': {
        target: 'http://localhost:8098',
        changeOrigin: true,
      },
      '/api/ai': {
        target: 'http://localhost:8098',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
