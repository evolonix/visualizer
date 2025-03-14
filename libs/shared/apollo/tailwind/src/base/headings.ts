/**
 * Since the hybrid solutions don't include base styles,
 * these base styles are not included in the config in order to be consistent everywhere.
 */
import { CSSRuleObject, PluginUtils } from 'tailwindcss/types/config';

export default (theme: PluginUtils['theme']) =>
  ({
    h1: {
      fontSize: theme('fontSize.4xl'),
      lineHeight: theme('lineHeight.10'),
      fontWeight: theme('fontWeight.bold'),
    },
    h2: {
      fontSize: theme('fontSize.3xl'),
      lineHeight: theme('lineHeight.9'),
      fontWeight: theme('fontWeight.bold'),
    },
    h3: {
      fontSize: theme('fontSize.2xl'),
      lineHeight: theme('lineHeight.8'),
      fontWeight: theme('fontWeight.bold'),
    },
    h4: {
      fontWeight: theme('fontWeight.extrabold'),
    },
  }) satisfies CSSRuleObject;
