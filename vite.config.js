import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api-2chat': {
        target: 'https://api.p.2chat.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-2chat/, ''),
      },
      '/api-catbox': {
        target: 'https://catbox.moe',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-catbox/, ''),
      },
      '/api-tts': {
        target: 'https://translate.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-tts/, ''),
        headers: {
          Referer: 'https://translate.google.com/',
          Origin: 'https://translate.google.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Referer', 'https://translate.google.com/');
            proxyReq.setHeader('Origin', 'https://translate.google.com');
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
          });
        },
      },
      '/api-gemini': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-gemini/, ''),
      },
    },
  },
})
