import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import App from './App.tsx'

const stored = localStorage.getItem('catalog-theme')
const theme = stored ?? 'dark'
document.documentElement.classList.toggle('dark', theme === 'dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
