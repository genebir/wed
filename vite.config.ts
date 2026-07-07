import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 배포 시 base가 리포지토리 이름과 일치해야 한다.
export default defineConfig({
  base: '/wed/',
  plugins: [react()],
})
