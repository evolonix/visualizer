import { CSSRuleObject, PluginUtils } from 'tailwindcss/types/config';

/**
 * Shared radio default styles
 */
const radioInputs = (theme: PluginUtils['theme']) => ({
  appearance: 'none',
  position: 'relative',
  float: 'left',
  background: theme('colors.neutral.50'),
  borderColor: theme('colors.neutral.300'),
  height: theme('height.4'),
  width: theme('width.4'),
  marginInlineEnd: theme('spacing.1'),
  marginTop: theme('spacing.1'),
  color: theme('colors.blue.800'),

  '&:hover': {
    cursor: 'pointer',
    borderWidth: theme('borderWidth.1'),
    borderColor: 'currentColor',
  },

  '&:focus': {
    outlineColor: 'currentColor',
  },

  '&:after': {
    borderRadius: theme('borderRadius.full'),
    content: 'var(--tw-content)',
    display: 'block',
    height: theme('height.4'),
    width: theme('height.4'),
    position: 'absolute',
    zIndex: '1',
  },

  '&:disabled': {
    background: 'transparent',
    borderColor: theme('colors.neutral.400'),
    borderStyle: 'dashed',
    cursor: 'not-allowed',

    '&hover': {
      borderColor: theme('colors.neutral.400'),
    },

    '&:checked:after': {
      left: '3px',
      top: '3px',
      height: '0.5rem',
      width: '0.5rem',
      backgroundColor: theme('colors.neutral.400'),
    },
  },
});

/**
 * Radio label styles
 */
const radioLabels = (theme: PluginUtils['theme']) => ({
  marginLeft: theme('spacing.1'),
  cursor: 'pointer',

  '&.radio-checked': {
    fontWeight: theme('fontWeight.semibold'),
  },

  '&.radio-disabled': {
    color: theme('colors.neutral.600'),
    cursor: 'not-allowed',
  },
});

export default (theme: PluginUtils['theme']) =>
  ({
    '.radio': {
      ...radioInputs(theme),
    },

    '.radio-label': {
      ...radioLabels(theme),
    },
  }) satisfies CSSRuleObject;
