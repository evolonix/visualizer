import tailwindPreset from '@degreed/apollo-tailwind';
import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import { join } from 'path';
import { Config } from 'tailwindcss';

export default {
  presets: [tailwindPreset],
  darkMode: 'selector',
  content: [
    join(__dirname, 'index.pages.html'),
    join(__dirname, 'pages/**/*!(*.spec).{html,ts,tsx}'),
    join(__dirname, 'src/app/pages/page.tsx'),
    join(__dirname, 'src/lib/page.utils.ts'),
    join(__dirname, 'src/lib/preview.utils.ts'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
