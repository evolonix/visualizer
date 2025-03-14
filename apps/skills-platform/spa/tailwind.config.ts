import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import { join } from 'path';

import tailwindPreset from '@degreed/apollo-tailwind';
import { Config } from 'tailwindcss';

export default {
  presets: [tailwindPreset],
  content: [
    join(__dirname, '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      keyframes: {
        unicorn: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(-10deg)' },
          '90%': { transform: 'rotate(45deg)' },
        },
      },
      animation: {
        // Used to animate the unicorn on the skills-platform app's mappings-details page
        // cubic-bezier is a back-out easing function
        unicorn: 'unicorn 325ms cubic-bezier(0.33, 1.53, 0.69, 0.99) 5', // No longer used :( RIP :teardrop:
      },
    },
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [],
} satisfies Config;
