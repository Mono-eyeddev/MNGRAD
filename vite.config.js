import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages project repositories, set base to '/YOUR-REPOSITORY-NAME/'.
// Keep '/' for local development or a user/organization site.
export default defineConfig({
  plugins: [react()],
  base: '/MNGRAD',
})
