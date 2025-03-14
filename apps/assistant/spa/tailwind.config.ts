import tailwindPreset from '@degreed/apollo-tailwind';
import { createGlobPatternsForDependencies } from '@nx/angular/tailwind';
import { join } from 'path';
import { Config } from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [tailwindPreset],
  darkMode: 'selector',
  content: [
    join(__dirname, '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
