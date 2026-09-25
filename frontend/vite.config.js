import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 5173,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Proxies /api calls to the standalone backend server during local dev,
      // so the frontend can keep calling relative '/api/...' paths without
      // hitting CORS. Set VITE_API_URL in .env instead if you'd rather call
      // the backend's full URL directly (e.g. when deployed separately).
      proxy: {
        '/api': {
          target: process.env.VITE_BACKEND_ORIGIN || 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  };
});
