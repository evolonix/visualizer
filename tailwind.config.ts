import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import { join } from 'path';
import { type Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { CSSRuleObject, PluginUtils } from 'tailwindcss/types/config';

const variablePrefix = 'tw';

/**
 * Recursively extract color variables from the theme
 * and apply the apollo prefix to the variable names
 */
function extractColorVariables(
  colors: Record<string, string | Record<string, string>>,
  colorGroup = '',
) {
  return Object.keys(colors).reduce(
    (acc, colorKey) => {
      const value = colors[colorKey];

      const variables: Record<string, string> =
        typeof value === 'string'
          ? { [`--${variablePrefix}-color${colorGroup}-${colorKey}`]: value }
          : extractColorVariables(value, `-${colorKey}`);

      return { ...acc, ...variables };
    },
    {} as Record<string, string>,
  );
}

/**
 * Generate CSS variables for all colors in the theme
 */
const cssVariables = (theme: PluginUtils['theme']) =>
  ({
    ':root': extractColorVariables(theme('colors')),
  }) satisfies CSSRuleObject;

export default {
  content: [
    join(__dirname, 'index.html'),
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase(cssVariables(theme));
    }),
  ],
} as Config;
