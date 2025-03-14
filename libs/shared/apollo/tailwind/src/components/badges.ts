import { CSSRuleObject, PluginUtils } from 'tailwindcss/types/config';

/**
 * Badge default styles
 */
const badgeDefaults = (theme: PluginUtils['theme']) => ({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  textTransform: 'uppercase',
  gap: theme('spacing.1'),
  flexShrink: '0',
  borderWidth: theme('borderWidth.DEFAULT'),
  borderStyle: 'solid',
  borderRadius: theme('borderRadius.full'),
  fontSize: theme('fontSize.xs'),
  lineHeight: theme('lineHeight.4'),
  fontWeight: theme('fontWeight.extrabold'),
  padding: `${theme('spacing.1')} ${theme('spacing.2')}`,

  '&.badge-large': {
    padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
  },

  '&.badge-small': {
    padding: `${theme('spacing[0.5]')} ${theme('spacing.1')}`,
  },

  '&.badge-icon': {
    padding: `${theme('spacing.1')} ${theme('spacing.1')}`,
    minWidth: theme('spacing.6'),

    '&.badge-small': {
      padding: `${theme('spacing[0.5]')} ${theme('spacing[0.5]')}`,
    },
  },
});

export default (theme: PluginUtils['theme']) =>
  ({
    '.badge-neutral': {
      ...badgeDefaults(theme),

      borderColor: theme('colors.neutral.300'),
      backgroundColor: theme('colors.neutral.100'),
      color: theme('colors.neutral.800'),
    },

    '.badge-red': {
      ...badgeDefaults(theme),

      borderColor: theme('colors.red.300'),
      backgroundColor: theme('colors.red.50'),
      color: theme('colors.red.800'),
    },

    '.badge-purple': {
      ...badgeDefaults(theme),

      borderColor: theme('colors.purple.300'),
      backgroundColor: theme('colors.purple.50'),
      color: theme('colors.purple.800'),
    },

    '.badge-green': {
      ...badgeDefaults(theme),

      borderColor: theme('colors.green.300'),
      backgroundColor: theme('colors.green.50'),
      color: theme('colors.green.800'),
    },

    '.badge-yellow': {
      ...badgeDefaults(theme),

      borderColor: theme('colors.yellow.300'),
      backgroundColor: theme('colors.yellow.50'),
      color: theme('colors.yellow.800'),
    },
  }) satisfies CSSRuleObject;
