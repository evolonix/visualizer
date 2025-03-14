import aspectRatio from '@tailwindcss/aspect-ratio';
import forms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';
import safeArea from 'tailwindcss-safe-area';
import defaultColors from 'tailwindcss/colors';
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

import { DarkModeConfig } from 'tailwindcss/types/config';
import badges from '../components/badges';
import buttons from '../components/buttons';
import grid from '../components/grid';
import radios from '../components/radios';
import reset from '../components/reset';
import cssVariables from '../utilities/css-variables';
import colors from './colors';
import { rem2px } from './utils';

// Convert rem to px for the default Tailwind CSS theme
// This is necessary for the hybrid solutions to work correctly,
// especially when the base font size is not 16px.
const defaultThemeWithPixels = rem2px(defaultTheme);

export const tailwindPreset = {
  prefix: 'tw-',
  safelist: ['reset', 'no-reset'],
  darkMode: 'selector' as DarkModeConfig,
  theme: {
    ...defaultThemeWithPixels,
    colors: {
      current: defaultColors.current,
      inherit: defaultColors.inherit,
      transparent: defaultColors.transparent,
      black: defaultColors.black,
      white: defaultColors.white,
      ...colors,
    },
    boxShadow: {
      none: '0 0 0 rgba(0, 0, 0, 0)',
      sm: '0 1px 2px rgba(53, 60, 66, 0.08)',
      md: '0 1px 2px rgba(53, 60, 66, 0.24)',
      lg: '0 4px 6px -1px rgba(53, 60, 66, 0.1), 0 2px 4px -2px rgba(53, 60, 66, 0.05)',
      xl: '0 10px 15px -3px rgba(53, 60, 66, 0.1), 0 4px 6px rgba(53, 60, 66, 0.05)',
      '2xl': '0 20px 25px -5px rgba(53, 60, 66, 0.1), 0 10px 10px rgba(53, 60, 66, 0.04)',
    },
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    forms,
    aspectRatio,
    safeArea,
    plugin(({ addComponents, addUtilities, theme }) => {
      /*
      Don't add base plugins for now.
      Base styles directly on elements could intefere
      with the host app in a hybrid solution.
      */
      // addBase(headings(theme));

      /* Reset styles for hybrid solutions */
      addComponents(reset(theme));

      addComponents(grid(theme));
      addComponents(badges(theme));
      addComponents(buttons(theme));
      addComponents(radios(theme));

      addUtilities(cssVariables(theme));

      // addUtilities({
      //   '.cdk-overlay-dark-backdrop': {
      //     background: theme('colors.neutral.900 / 80%'),
      //   },
      // });
    }),
  ],
} satisfies Omit<Config, 'content'>;
