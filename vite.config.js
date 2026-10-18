import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project repository
export default defineConfig({
  plugins: [react()],
  base: '/MNGRAD/',
})
