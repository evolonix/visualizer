/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import packageJson from './package.json';

export default defineConfig((env) => ({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/apps/skills-platform/spa',

  server: {
    port: 4203,
    host: 'localhost',
    fs: {
      strict: false,
    },
  },

  preview: {
    port: 4303,
    host: 'localhost',
  },

  plugins: [
    react(),
    nxViteTsPaths(),
    viteStaticCopy({
      targets: [
        {
          src: 'package.json',
          dest: '',
        },
        {
          src: 'README.md',
          dest: '',
        },
      ],
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../../dist/apps/skills-platform/spa',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        // entryFileNames: env.mode === 'production' ? 'assets/[name]-[hash].js' : 'assets/[name].js',
        // chunkFileNames: env.mode === 'production' ? 'assets/[name]-[hash].js' : 'assets/[name].js',
        // assetFileNames: env.mode === 'production' ? 'assets/[name]-[hash][extname]' : 'assets/[name][extname]',
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false,
      },
    },
    sourcemap: env.mode === 'production' ? false : true,
  },

  test: {
    globals: true,
    cache: {
      dir: '../../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/apps/skills-platform/spa',
      provider: 'v8',
    },

    passWithNoTests: true,
  },

  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
  },
}));
