import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    // Increase chunk size warning limit to reduce non-actionable warnings for large bundles.
    // If you prefer to actually split large chunks, replace this with `rollupOptions.manualChunks` configuration.
    chunkSizeWarningLimit: 800
  }
});