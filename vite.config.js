import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api/unsplash': {
        target: 'https://api.unsplash.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/unsplash/, ''),
      },
    },
  },
})
