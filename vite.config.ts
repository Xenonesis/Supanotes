import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  // SEO and Performance optimizations
  build: {
    // Generate source maps for better debugging
    sourcemap: false,
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react', 'framer-motion'],
        },
      },
    },
    // Enable gzip compression
    reportCompressedSize: true,
    // Optimize CSS
    cssCodeSplit: true,
  },

  // Server configuration for development
  server: {
    // Enable CORS for development
    cors: true,
    // Optimize HMR
    hmr: {
      overlay: true,
    },
  },
});
