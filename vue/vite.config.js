import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 2000,
    emptyOutDir: true,
    outDir: 'static',
    esbuild: {
      target: 'es2022'
    },
    rollupOptions: {
      output: {
        manualChunks: {
          deckgl: ['@deck.gl/aggregation-layers', '@deck.gl/core'],
          mapboxgl: ['mapbox-gl', '@mapbox/mapbox-gl-draw'],
          vue: ['vue', 'vue-router', 'pinia']
        }
      }
    }
  },
  define: {
    __VUE_OPTIONS_API__: 'false',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
  },
  plugins: [vueJsx()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  test: {
    environment: 'jsdom',
    fileParallelism: false,
    globals: true,
    include: ['src/**/index.test.ts'],
    outputFile: 'src/test/vitest.json',
    reporters: 'json',
    setupFiles: 'src/test/setup.ts',
    transformMode: {
      web: [/\.tsx$/]
    }
  }
})
