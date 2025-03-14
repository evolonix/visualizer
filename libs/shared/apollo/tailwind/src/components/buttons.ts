import { CSSRuleObject, PluginUtils } from 'tailwindcss/types/config';

/**
 * Shared button default styles
 */
const sharedButtonDefaults = (theme: PluginUtils['theme']) => ({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme('spacing.1'),
  flexShrink: '0',
  borderStyle: 'none',
  borderRadius: theme('borderRadius.lg'),
  fontSize: theme('fontSize.xs'),
  lineHeight: theme('lineHeight.4'),
  fontWeight: theme('fontWeight.semibold'),
  padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
  outlineStyle: 'solid',
  outlineWidth: theme('outlineWidth.2'),
  outlineColor: 'transparent',
  outlineOffset: theme('outlineWidth.2'),
});

/**
 * Button default styles
 */
const buttonDefaults = (theme: PluginUtils['theme']) => ({
  ...sharedButtonDefaults(theme),

  '&.btn-small': {
    fontSize: theme('fontSize.xs'),
    padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
  },

  '&.btn-medium': {
    fontSize: theme('fontSize.xs'),
    padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
  },

  '&.btn-icon': {
    fontSize: theme('fontSize.base'),
    padding: `${theme('spacing.1')} ${theme('spacing.1')}`,

    '&.btn-small': {
      padding: `${theme('spacing.1')} ${theme('spacing.1')}`,
    },

    '&.btn-medium': {
      padding: `${theme('spacing.2')} ${theme('spacing.2')}`,
    },
  },

  '&.btn-icon.not-btn-icon': {
    fontSize: theme('fontSize.xs'),

    '&.btn-small': {
      padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
    },

    '&.btn-medium': {
      padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
    },
  },
});

const ghostButtonDefaults = (theme: PluginUtils['theme']) => ({
  ...sharedButtonDefaults(theme),

  '&.btn-icon': {
    fontSize: theme('fontSize.base'),
    padding: `${theme('spacing.1')} ${theme('spacing.1')}`,
  },
});

/**
 * Ghost button styles
 */
export default (theme: PluginUtils['theme']) =>
  ({
    '.btn-primary': {
      ...buttonDefaults(theme),

      backgroundColor: theme('colors.blue.800'),
      color: theme('colors.white'),

      '&.btn-large': {
        fontSize: theme('fontSize.base'),
        padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
      },

      '&:hover': {
        backgroundColor: theme('colors.blue.900'),
      },

      '&:focus': {
        outlineColor: theme('colors.blue.800'),
        outlineOffset: theme('outlineWidth.1'),
      },

      '&:active': {
        backgroundColor: theme('colors.blue.950'),
      },

      '&:disabled': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.blue.600'),
        backgroundColor: theme('colors.blue.50'),
        color: theme('colors.blue.800'),
      },

      '&[aria-disabled="true"]': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.blue.600'),
        backgroundColor: theme('colors.blue.50'),
        color: theme('colors.blue.800'),
        cursor: 'default',

        '&:focus': {
          outlineOffset: theme('outlineWidth.0'),
        },
      },
    },

    '.btn-destructive': {
      ...buttonDefaults(theme),

      backgroundColor: theme('colors.red.800'),
      color: theme('colors.white'),

      '&:hover': {
        backgroundColor: theme('colors.red.900'),
      },

      '&:focus': {
        outlineColor: theme('colors.red.800'),
        outlineOffset: theme('outlineWidth.1'),
      },

      '&:active': {
        backgroundColor: theme('colors.red.950'),
      },

      '&:disabled': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.red.600'),
        backgroundColor: theme('colors.red.50'),
        color: theme('colors.red.800'),
      },

      '&[aria-disabled="true"]': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.red.600'),
        backgroundColor: theme('colors.red.50'),
        color: theme('colors.red.800'),
        cursor: 'default',

        '&:focus': {
          outlineOffset: theme('outlineWidth.0'),
        },
      },

      '&.btn-icon': {
        backgroundColor: theme('colors.red.100'),
        color: theme('colors.red.800'),

        '&:hover': {
          backgroundColor: theme('colors.red.100'),
          color: theme('colors.red.900'),
        },

        '&:focus': {
          color: theme('colors.red.900'),
        },

        '&:active': {
          backgroundColor: theme('colors.red.200'),
          color: theme('colors.red.950'),
        },

        '&:disabled': {
          backgroundColor: theme('colors.red.50'),
        },
      },
    },

    '.btn-secondary-outline': {
      ...buttonDefaults(theme),

      backgroundColor: theme('colors.white'),
      color: theme('colors.neutral.800'),
      '--tw-ring-color': theme('colors.neutral.300'),
      '--tw-ring-shadow': '0 0 0 1px var(--tw-ring-color)',
      boxShadow: 'var(--tw-ring-shadow)',

      '&:hover': {
        backgroundColor: theme('colors.neutral.50'),
        color: theme('colors.neutral.900'),
      },

      '&:focus': {
        backgroundColor: theme('colors.neutral.50'),
        color: theme('colors.neutral.900'),
        outlineColor: theme('colors.neutral.900'),
        outlineOffset: theme('outlineWidth.0'),
      },

      '&:active': {
        backgroundColor: theme('colors.neutral.100'),
        color: theme('colors.neutral.950'),
      },

      '&:disabled': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.neutral.600'),
        backgroundColor: theme('colors.neutral.50'),
        color: theme('colors.neutral.600'),
        boxShadow: 'none',
      },

      '&[aria-disabled="true"]': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.neutral.600'),
        backgroundColor: theme('colors.neutral.50'),
        color: theme('colors.neutral.600'),
        boxShadow: 'none',
        cursor: 'default',
      },
    },

    '.btn-secondary-filled': {
      ...buttonDefaults(theme),

      backgroundColor: theme('colors.neutral.100'),
      color: theme('colors.neutral.800'),

      '&:hover': {
        backgroundColor: theme('colors.neutral.200'),
        color: theme('colors.neutral.900'),
      },

      '&:focus': {
        backgroundColor: theme('colors.neutral.100'),
        outlineColor: theme('colors.neutral.900'),
        outlineOffset: theme('outlineWidth.0'),
      },

      '&:active': {
        backgroundColor: theme('colors.neutral.300'),
        color: theme('colors.neutral.950'),
      },

      '&:disabled': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.neutral.600'),
        backgroundColor: theme('colors.neutral.50'),
        color: theme('colors.neutral.600'),
      },

      '&[aria-disabled="true"]': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.neutral.600'),
        backgroundColor: theme('colors.neutral.50'),
        color: theme('colors.neutral.600'),
        cursor: 'default',
      },
    },

    '.btn-tertiary': {
      ...buttonDefaults(theme),

      color: theme('colors.blue.800'),

      '&:hover': {
        backgroundColor: theme('colors.blue.100'),
        color: theme('colors.blue.900'),
      },

      '&:focus': {
        backgroundColor: theme('colors.blue.50'),
        color: theme('colors.blue.800'),
        outlineColor: theme('colors.blue.800'),
        outlineOffset: theme('outlineWidth.0'),
      },

      '&:active': {
        backgroundColor: theme('colors.blue.200'),
        color: theme('colors.blue.950'),
      },

      '&:disabled': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.blue.600'),
        backgroundColor: theme('colors.blue.50'),
        color: theme('colors.blue.600'),
      },

      '&[aria-disabled="true"]': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.blue.600'),
        backgroundColor: theme('colors.blue.50'),
        color: theme('colors.blue.600'),
        cursor: 'default',
      },
    },

    '.btn-tertiary-neutral': {
      ...buttonDefaults(theme),

      color: theme('colors.neutral.800'),

      '&:hover': {
        backgroundColor: theme('colors.neutral.100'),
        color: theme('colors.neutral.900'),
      },

      '&:focus': {
        backgroundColor: theme('colors.neutral.50'),
        color: theme('colors.neutral.800'),
        outlineColor: theme('colors.neutral.800'),
        outlineOffset: theme('outlineWidth.0'),
      },

      '&:active': {
        backgroundColor: theme('colors.neutral.200'),
        color: theme('colors.neutral.950'),
      },

      '&:disabled': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.neutral.600'),
        backgroundColor: theme('colors.neutral.50'),
        color: theme('colors.neutral.600'),
      },

      '&[aria-disabled="true"]': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.neutral.600'),
        backgroundColor: theme('colors.neutral.50'),
        color: theme('colors.neutral.600'),
        cursor: 'default',
      },
    },

    '.btn-tertiary-destructive': {
      ...buttonDefaults(theme),

      color: theme('colors.red.800'),

      '&:hover': {
        backgroundColor: theme('colors.red.100'),
        color: theme('colors.red.900'),
      },

      '&:focus': {
        backgroundColor: theme('colors.red.50'),
        color: theme('colors.red.800'),
        outlineColor: theme('colors.red.800'),
        outlineOffset: theme('outlineWidth.0'),
      },

      '&:active': {
        backgroundColor: theme('colors.red.200'),
        color: theme('colors.red.950'),
      },

      '&:disabled': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.red.600'),
        backgroundColor: theme('colors.red.50'),
        color: theme('colors.red.600'),
      },

      '&[aria-disabled="true"]': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.red.600'),
        backgroundColor: theme('colors.red.50'),
        color: theme('colors.red.600'),
        cursor: 'default',
      },
    },

    '.btn-ghost-purple': {
      ...ghostButtonDefaults(theme),

      color: theme('colors.purple.900'),

      '&:hover': {
        backgroundColor: theme('colors.purple.200'),
        color: theme('colors.purple.950'),
      },

      '&:focus': {
        backgroundColor: theme('colors.purple.200'),
        outlineColor: theme('colors.purple.900'),
        outlineOffset: theme('outlineWidth.0'),
      },

      '&:active': {
        backgroundColor: theme('colors.purple.300'),
        color: theme('colors.purple.950'),
      },

      '&:disabled': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.purple.600'),
        backgroundColor: theme('colors.purple.50'),
      },

      '&[aria-disabled="true"]': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.purple.600'),
        backgroundColor: theme('colors.purple.50'),
        cursor: 'default',
      },
    },

    '.btn-ghost-neutral': {
      ...ghostButtonDefaults(theme),

      color: theme('colors.neutral.900'),

      '&:hover': {
        backgroundColor: theme('colors.neutral.200'),
        color: theme('colors.neutral.950'),
      },

      '&:focus': {
        backgroundColor: theme('colors.neutral.200'),
        outlineColor: theme('colors.neutral.900'),
        outlineOffset: theme('outlineWidth.0'),
      },

      '&:active': {
        backgroundColor: theme('colors.neutral.300'),
        color: theme('colors.neutral.950'),
      },

      '&:disabled': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.neutral.600'),
        backgroundColor: theme('colors.neutral.50'),
      },

      '&[aria-disabled="true"]': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.neutral.600'),
        backgroundColor: theme('colors.neutral.50'),
        cursor: 'default',
      },
    },

    '.btn-ghost-green': {
      ...ghostButtonDefaults(theme),

      color: theme('colors.green.900'),

      '&:hover': {
        backgroundColor: theme('colors.green.200'),
        color: theme('colors.green.950'),
      },

      '&:focus': {
        backgroundColor: theme('colors.green.200'),
        outlineColor: theme('colors.green.900'),
        outlineOffset: theme('outlineWidth.0'),
      },

      '&:active': {
        backgroundColor: theme('colors.green.300'),
        color: theme('colors.green.950'),
      },

      '&:disabled': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.green.600'),
        backgroundColor: theme('colors.green.50'),
      },

      '&[aria-disabled="true"]': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.green.600'),
        backgroundColor: theme('colors.green.50'),
        cursor: 'default',
      },
    },

    '.btn-ghost-yellow': {
      ...ghostButtonDefaults(theme),

      color: theme('colors.yellow.900'),

      '&:hover': {
        backgroundColor: theme('colors.yellow.200'),
        color: theme('colors.yellow.950'),
      },

      '&:focus': {
        backgroundColor: theme('colors.yellow.200'),
        outlineColor: theme('colors.yellow.900'),
        outlineOffset: theme('outlineWidth.0'),
      },

      '&:active': {
        backgroundColor: theme('colors.yellow.300'),
        color: theme('colors.yellow.950'),
      },

      '&:disabled': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.yellow.600'),
        backgroundColor: theme('colors.yellow.50'),
      },

      '&[aria-disabled="true"]': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.yellow.600'),
        backgroundColor: theme('colors.yellow.50'),
        cursor: 'default',
      },
    },

    '.btn-ghost-red': {
      ...ghostButtonDefaults(theme),

      color: theme('colors.red.900'),

      '&:hover': {
        backgroundColor: theme('colors.red.200'),
        color: theme('colors.red.950'),
      },

      '&:focus': {
        backgroundColor: theme('colors.red.200'),
        outlineColor: theme('colors.red.900'),
        outlineOffset: theme('outlineWidth.0'),
      },

      '&:active': {
        backgroundColor: theme('colors.red.300'),
        color: theme('colors.red.950'),
      },

      '&:disabled': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.red.600'),
        backgroundColor: theme('colors.red.50'),
      },

      '&[aria-disabled="true"]': {
        borderStyle: 'dashed',
        borderWidth: theme('borderWidth.DEFAULT'),
        borderColor: theme('colors.red.600'),
        backgroundColor: theme('colors.red.50'),
        cursor: 'default',
      },
    },
  }) satisfies CSSRuleObject;
