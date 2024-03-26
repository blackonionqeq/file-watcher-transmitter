
// vite.config.js
import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

const root = './src'
export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, root, 'index.html'),
        sub: resolve(__dirname, root, 'sub/index.html'),
      }
    },
  },
  root,
  server: {
    host: true,
    port: 3300,
    https: false,
    // watch: {
    //   usePolling: true,
    // },
  },
});
