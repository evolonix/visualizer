# Using Apollo in the Visualizer

The Visualizer has two Tailwind CSS configurations: one for the Visualizer app itself and one for the HTML-1st previews. The Visualizer configuration is located in `apps/visualizer/spa/tailwind.config.ts` and the HTML-1st configuration is located in `apps/visualizer/spa/tailwind.pages.config.ts`. The HTML-1st configuration extends the Apollo workspace configuration presets via a custom Tailwind CSS preset in the `libs/shared/apollo/tailwind` library.
