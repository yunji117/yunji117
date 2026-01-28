// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/yunji117/', // GitHub Pages 배포용 경로
  build: {
    outDir: 'dist',
  },
})
