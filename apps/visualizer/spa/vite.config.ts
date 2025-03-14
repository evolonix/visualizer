import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, ViteDevServer } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import packageJson from './package.json';

/**
 * This plugin will route to the correct index html file for the mpa
 * to address the issue with each page having its own router.
 */
const multiPageAppIndexRouting = () => ({
  root: __dirname,
  build: {
    outDir: '../../../dist/apps/visualizer/spa',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  name: 'configure-server',
  configureServer(server: ViteDevServer) {
    return () => {
      server.middlewares.use(async (req, _, next) => {
        if (server.config.build.rollupOptions.input) {
          const inputs = Object.keys(server.config.build.rollupOptions.input).filter((key) => key !== 'main');
          for (const appName of inputs) {
            if (req.originalUrl?.startsWith(`/${appName}`)) {
              req.url = `/index.${appName}.html`;
              break;
            }
          }
        }
        next();
      });
    };
  },
});

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/visualizer',

  server: {
    port: 4200,
    host: 'localhost',

    fs: {
      allow: ['..'],
    },
  },

  preview: {
    port: 4300,
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
    // Provide build options to the multiPageAppIndexRouting plugin instead of the build property
    multiPageAppIndexRouting(),
  ],

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        pages: resolve(__dirname, 'index.pages.html'),
      },
    },
  },

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  test: {
    globals: true,
    cache: { dir: '../../../node_modules/.vitest' },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/apps/jasonruesch',
      provider: 'v8',
    },

    passWithNoTests: true,
  },

  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
  },
});
