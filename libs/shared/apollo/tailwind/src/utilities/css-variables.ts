import { CSSRuleObject, PluginUtils } from 'tailwindcss/types/config';

const variablePrefix = 'apollo';

/**
 * Recursively extract color variables from the theme
 * and apply the apollo prefix to the variable names
 */
function extractColorVariables(colors: Record<string, string | Record<string, string>>, colorGroup = '') {
  return Object.keys(colors).reduce(
    (acc, colorKey) => {
      const value = colors[colorKey];

      const variables: Record<string, string> =
        typeof value === 'string'
          ? { [`--${variablePrefix}-color${colorGroup}-${colorKey}`]: value }
          : extractColorVariables(value, `-${colorKey}`);

      return { ...acc, ...variables };
    },
    {} as Record<string, string>
  );
}

/**
 * Generate CSS variables for all colors in the theme
 */
export default (theme: PluginUtils['theme']) =>
  ({
    ':root': extractColorVariables(theme('colors')),
  }) satisfies CSSRuleObject;
