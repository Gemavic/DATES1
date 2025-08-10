import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Build configuration for production
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', '@radix-ui/react-progress', '@radix-ui/react-slot'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  },
  
  // Development server configuration
  server: {
    host: true,
    port: 5173,
    hmr: {
      port: 5173
    }
  },
  
  // Preview server configuration
  preview: {
    host: true,
    port: 4173
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  
  // CSS configuration
  css: {
    postcss: './postcss.config.js'
  },
  
  // Environment variables
  define: {
    'process.env': {}
  },
  
  // Optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react'
    ]
  }
});