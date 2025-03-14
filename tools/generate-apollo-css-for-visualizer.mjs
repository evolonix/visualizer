/**
 * This file has the mjs extension to allow the use of ES6 `import` statements.
 * It is then run using the node command from the build target in the apps/visualizer/spa-old/project.json file.
 */

import autoprefixer from 'autoprefixer';
import * as fs from 'fs';
import * as path from 'path';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

/***
 * This processes the tailwindcss file for Apollo separate from the app's tailwindcss file.
 * The HTML-1st previews use the Apollo tailwindcss file.
 * @docs https://github.com/degreed/fe-workspace/blob/main/apps/visualizer/spa-old/docs/using-apollo.md
 */
const processApolloCss = async () => {
  const srcDir = 'apps/visualizer/spa-old';
  const destDir = 'apps/visualizer/spa-old';
  const srcCssPath = path.join(srcDir, 'styles/apollo.css');
  const destCssPath = path.join(destDir, 'public/apollo.css');
  const css = fs.readFileSync(srcCssPath, 'utf8');
  const tailwindConfigPath = path.join(srcDir, 'tailwind-apollo.config.ts');
  const result = await postcss([
    tailwindcss({
      config: tailwindConfigPath,
    }),
    autoprefixer,
  ]).process(css, { from: srcCssPath, to: destCssPath });
  fs.writeFileSync(destCssPath, result.css);
};

console.log('Generating Apollo styles for the Visualizer...');
processApolloCss();
console.log('Finished generating Apollo styles for the Visualizer!');
