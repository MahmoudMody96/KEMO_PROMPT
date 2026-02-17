import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react'],
          // Split the heavy prompt engine into its own chunk
          'prompt-engine': ['./src/api/promptApi.js', './src/api/knowledgeBase.js'],
        }
      }
    },
    chunkSizeWarningLimit: 800,
  }
})
