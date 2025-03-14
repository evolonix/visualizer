import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import formsPlugin from '@tailwindcss/forms';
import { join } from 'path';
import { Config } from 'tailwindcss';

export default {
  content: [
    join(__dirname, 'index.html'),
    join(__dirname, 'src/**/*!(*.spec).{ts,tsx}'),
    join(__dirname, '!src/app/pages/page.tsx'),
    join(__dirname, '!src/lib/page.utils.ts'),
    join(__dirname, '!src/lib/preview.utils.ts'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      screens: {
        xs: '390px',
      },
      minWidth: ({ theme }) => ({
        xs: theme('screens.xs'),
      }),
    },
  },
  plugins: [formsPlugin],
} satisfies Config;
