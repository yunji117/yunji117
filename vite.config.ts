// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 깃헙아이디/레포명/ 으로 설정!
export default defineConfig({
  plugins: [react()],
  base: '/yunji117.github.io/yunji117',
})
