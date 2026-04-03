import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: { port: parseInt(process.env.PORT || '8005') },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
