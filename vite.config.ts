/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, splitVendorChunkPlugin } from 'vite';

export default defineConfig({
  root: __dirname,
  cacheDir: './node_modules/.vite/visualizer',

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [react(), splitVendorChunkPlugin(), nxViteTsPaths()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: './dist/visualizer',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('@heroicons/react/16/solid')) {
            return '@heroicons/react/16/solid';
          }
          if (id.includes('@heroicons/react/20/solid')) {
            return '@heroicons/react/20/solid';
          }
          if (id.includes('@heroicons/react/24/solid')) {
            return '@heroicons/react/24/solid';
          }
          if (id.includes('@heroicons/react/24/outline')) {
            return '@heroicons/react/24/outline';
          }
        },
      },
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: './coverage/visualizer',
      provider: 'v8',
    },

    passWithNoTests: true,
  },
});
