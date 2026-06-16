import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Encaminha as chamadas /api/* para o back-end Express (porta 3001).
    // Assim o front usa URLs relativas e não precisamos lidar com CORS no navegador.
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // remove o prefixo /api antes de repassar:  /api/memorias -> /memorias
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
