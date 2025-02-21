import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    external: ['jwt-decode'],  // Prevent Vite from bundling jwt-decode
  },
  optimizeDeps: {
    include: ['jwt-decode'],  // Ensure that jwt-decode is optimized
  },
  // to match github page repo
})
