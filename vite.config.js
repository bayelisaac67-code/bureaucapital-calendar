import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative asset paths so the build works when served from a GitHub Pages subpath.
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
});
