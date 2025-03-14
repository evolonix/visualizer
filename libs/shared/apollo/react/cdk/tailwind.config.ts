import tailwindPreset from '@degreed/apollo-tailwind';
import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import { join } from 'path';
import { Config } from 'tailwindcss';

export default {
  presets: [tailwindPreset],
  content: [
    join(__dirname, '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [],
} satisfies Config;
