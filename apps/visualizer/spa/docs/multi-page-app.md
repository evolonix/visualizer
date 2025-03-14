# Multi Page Application

The Visualizer is configured as an [mpa](https://vitejs.dev/guide/build.html#multi-page-app).

```ts
appType: 'mpa',

build: {
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'index.html'),
      pages: resolve(__dirname, 'index.pages.html'),
    },
  },
},
```

The default entry point is `index.html` and the `index.pages.html` is used for the preview pages.

The majority of the Visualizer is built as a single page application (SPA).

The preview pages are served from the `/pages` path.

When viewing a preview page, the Visualizer will load the preview page into an iframe. Viewing the preview page full screen will load the preview page directly.
