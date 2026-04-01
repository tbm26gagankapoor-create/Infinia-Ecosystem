import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  base: '/user-portal-app/',
  plugins: [react(), tailwindcss()],
  server: { port: 8003 },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
