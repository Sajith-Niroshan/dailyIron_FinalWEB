import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      // Compress JS, CSS, and HTML
      include: [/\.(js|css|html)$/],
      // Don't compress source maps or images
      exclude: [/\.(map|jpg|png|gif|svg|webp)$/]
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Generate sourcemaps for better debugging
    sourcemap: true,
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react'],
        }
      }
    },
    // Enable chunk size reporting
    reportCompressedSize: true,
  }
});
