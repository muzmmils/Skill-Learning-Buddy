import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const apiUrl = env.VITE_API_URL || 'http://localhost:8787';
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:8787',
            changeOrigin: true,
            ws: true
          }
        }
      },
      plugins: [react()],
      define: {
        // Expose non-sensitive env vars to client
        'process.env.GEMINI_MODEL': JSON.stringify(env.GEMINI_MODEL),
        'process.env.VITE_API_URL': JSON.stringify(apiUrl)
      },
      build: {
        outDir: 'dist',
        sourcemap: false, // Set to true for debugging in production
        minify: 'esbuild', // Use esbuild (built-in, faster than terser)
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
            }
          }
        }
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
