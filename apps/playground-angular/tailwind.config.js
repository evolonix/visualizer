const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const plugin = require('tailwindcss/plugin');

const variablePrefix = 'tw';

/**
 * Recursively extract color variables from the theme
 * and apply the apollo prefix to the variable names
 */
function extractColorVariables(colors, colorGroup = '') {
  return Object.keys(colors).reduce((acc, colorKey) => {
    const value = colors[colorKey];

    const variables =
      typeof value === 'string'
        ? { [`--${variablePrefix}-color${colorGroup}-${colorKey}`]: value }
        : extractColorVariables(value, `-${colorKey}`);

    return { ...acc, ...variables };
  }, {});
}

/**
 * Generate CSS variables for all colors in the theme
 */
const cssVariables = (theme) => ({
  ':root': extractColorVariables(theme('colors')),
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
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
};
