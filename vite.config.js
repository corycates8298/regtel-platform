import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react( ), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
    allowedHosts: 'all'
  },
  preview: {
    host: '0.0.0.0', 
    port: process.env.PORT || 3000,
    allowedHosts: ['regulatory-intelligence-production.up.railway.app', 'localhost', '0.0.0.0']
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
