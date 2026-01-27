// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Vercel 배포용 루트 경로
  build: {
    outDir: 'dist',
  },
})
