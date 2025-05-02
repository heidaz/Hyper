import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore - no types available for this module
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true
      }
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: [
        // Mark problematic dependencies as external if needed
      ]
    }
  },
  resolve: {
    alias: {
      // Add any path aliases if needed
    },
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: ['@metaplex-foundation/js', '@solana/web3.js'],
    esbuildOptions: {
      target: 'es2020',
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    host: 'localhost',
    hmr: {
      protocol: 'ws',
      host: 'localhost', 
    },
  },
})
