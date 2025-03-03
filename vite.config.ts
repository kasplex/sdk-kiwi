import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  base: './',
  plugins: [
    dts(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'KasplexWeb3',
      fileName: 'index',
    },
    rollupOptions: {
      output: {
        globals: {
          liteMove: 'KasplexWeb3'
        }
      }
    },
  }
})