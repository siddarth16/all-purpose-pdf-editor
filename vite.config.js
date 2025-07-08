import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf-lib': ['pdf-lib'],
          'pdfjs': ['pdfjs-dist'],
          'tesseract': ['tesseract.js'],
          'ui': ['framer-motion', 'lucide-react']
        }
      }
    }
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
}) 