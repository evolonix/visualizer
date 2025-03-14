/*
Apollo foundations reset to use when preflight is disabled,
or to override existing styles in a hybrid solution
*/

import { PluginUtils } from 'tailwindcss/types/config';

export default (theme: PluginUtils['theme']) => ({
  '.reset': {
    fontFamily: theme('fontFamily.sans'),
    fontSize: theme('fontSize.base') /* 1rem */,
    lineHeight: theme('lineHeight.6') /* 1.5 */,
  },

  /*
  1. Use a consistent sensible line-height in all browsers.
  2. Prevent adjustments of font size after orientation changes in iOS.
  3. Use a more readable tab size.
  4. Use the user's configured `sans` font-family by default.
  5. Use the user's configured `sans` font-feature-settings by default.
  6. Use the user's configured `sans` font-variation-settings by default.
  7. Disable tap highlights on iOS
  */

  'html.reset, :host.reset': {
    lineHeight: '1.5' /* 1 */,
    '-webkit-text-size-adjust': '100%' /* 2 */,
    '-moz-tab-size': '4' /* 3 */,
    '-o-tab-size': '4',
    tabSize: '4' /* 3 */,
    fontFamily:
      'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' /* 4 */,
    fontFeatureSettings: 'normal' /* 5 */,
    fontFariationSettings: 'normal' /* 6 */,
    '-webkit-tap-highlight-color': 'transparent' /* 7 */,
  },

  /*
  1. Remove the margin in all browsers.
  2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.
  */

  'body.reset, .reset body': {
    margin: '0' /* 1 */,
    lineHeight: 'inherit' /* 2 */,
  },

  ':where(.reset), :where(.reset *)': {
    boxSizing: 'border-box',
    borderWidth: '0',
    borderStyle: 'solid',
    borderColor: 'currentColor',
    '--tw-border-spacing-x': '0',
    '--tw-border-spacing-y': '0',
    '--tw-translate-x': '0',
    '--tw-translate-y': '0',
    '--tw-rotate': '0',
    '--tw-skew-x': '0',
    '--tw-skew-y': '0',
    '--tw-scale-x': '1',
    '--tw-scale-y': '1',
    '--tw-pan-x': '',
    '--tw-pan-y': '',
    '--tw-pinch-zoom': '',
    '--tw-scroll-snap-strictness': 'proximity',
    '--tw-gradient-from-position': '',
    '--tw-gradient-via-position': '',
    '--tw-gradient-to-position': '',
    '--tw-ordinal': '',
    '--tw-slashed-zero': '',
    '--tw-numeric-figure': '',
    '--tw-numeric-spacing': '',
    '--tw-numeric-fraction': '',
    '--tw-ring-inset': '',
    '--tw-ring-offset-width': '0px',
    '--tw-ring-offset-color': '#fff',
    '--tw-ring-color': 'rgb(72 194 255 / 0.5)',
    '--tw-ring-offset-shadow': '0 0 #0000',
    '--tw-ring-shadow': '0 0 #0000',
    '--tw-shadow': '0 0 #0000',
    '--tw-shadow-colored': '0 0 #0000',
    '--tw-blur': '',
    '--tw-brightness': '',
    '--tw-contrast': '',
    '--tw-grayscale': '',
    '--tw-hue-rotate': '',
    '--tw-invert': '',
    '--tw-saturate': '',
    '--tw-sepia': '',
    '--tw-drop-shadow': '',
    '--tw-backdrop-blur': '',
    '--tw-backdrop-brightness': '',
    '--tw-backdrop-contrast': '',
    '--tw-backdrop-grayscale': '',
    '--tw-backdrop-hue-rotate': '',
    '--tw-backdrop-invert': '',
    '--tw-backdrop-opacity': '',
    '--tw-backdrop-saturate': '',
    '--tw-backdrop-sepia': '',
    '--tw-contain-size': '',
    '--tw-contain-layout': '',
    '--tw-contain-paint': '',
    '--tw-contain-style': '',

    '::before': {
      boxSizing: 'border-box',
      borderWidth: '0',
      borderStyle: 'solid',
      borderColor: 'currentColor',
      '--tw-content': "''",
    },
    '::after': {
      boxSizing: 'border-box',
      borderWidth: '0',
      borderStyle: 'solid',
      borderColor: 'currentColor',
      '--tw-content': "''",
    },
    html: {
      lineHeight: '1.5',
      '-webkit-text-size-adjust': '100%',
      '-moz-tab-size': '4',
      tabSize: '4',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontFeatureSettings: 'normal',
      fontVariationSettings: 'normal',
      '-webkit-tap-highlight-color': 'transparent',
    },
    ':host': {
      lineHeight: '1.5',
      '-webkit-text-size-adjust': '100%',
      '-moz-tab-size': '4',
      tabSize: '4',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontFeatureSettings: 'normal',
      fontVariationSettings: 'normal',
      '-webkit-tap-highlight-color': 'transparent',
    },
    body: {
      margin: '0',
      lineHeight: 'inherit',
    },
    hr: {
      height: '0',
      color: 'inherit',
      borderTopWidth: '1px',
    },
    'abbr:where([title])': {
      textDecoration: 'underline dotted',
    },
    'h1, h2, h3, h4, h5, h6': {
      color: 'inherit',
      fontSize: 'inherit',
      fontWeight: 'inherit',
    },
    // Applying base styles for headings since we currently disable base styles for hybrid solutions
    // Note: These can be removed in favor of ../base/headings.ts when preflight is enabled
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
    a: {
      color: 'inherit',
      textDecoration: 'inherit',
    },
    'b, strong': {
      fontWeight: 'bolder',
    },
    'code, kbd, samp, pre': {
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontFeatureSettings: 'normal',
      fontVariationSettings: 'normal',
      fontSize: '1em',
    },
    small: {
      fontSize: '12.8px',
    },
    'sub, sup': {
      fontSize: '12px',
      lineHeight: '0',
      position: 'relative',
      verticalAlign: 'baseline',
    },
    sub: {
      bottom: '-4px',
    },
    sup: {
      top: '-8px',
    },
    table: {
      textIndent: '0',
      borderColor: 'inherit',
      borderCollapse: 'collapse',
    },
    'button, input, optgroup, select, textarea': {
      fontFamily: 'inherit',
      fontFeatureSettings: 'inherit',
      fontVariationSettings: 'inherit',
      fontSize: '100%',
      fontWeight: 'inherit',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
      color: 'inherit',
      margin: '0',
      padding: '0',
    },
    'button, select': {
      textTransform: 'none',
    },
    'button, input:where([type="button"]), input:where([type="reset"]), input:where([type="submit"])': {
      '-webkit-appearance': 'button',
      backgroundColor: 'transparent',
      backgroundImage: 'none',
    },
    ':-moz-focusring': {
      outline: 'auto',
    },
    ':-moz-ui-invalid': {
      boxShadow: 'none',
    },
    progress: {
      verticalAlign: 'baseline',
    },
    '::-webkit-inner-spin-button, ::-webkit-outer-spin-button': {
      height: 'auto',
    },
    '[type="search"]': {
      '-webkit-appearance': 'textfield',
      outlineOffset: '-2px',
    },
    '::-webkit-search-decoration': {
      '-webkit-appearance': 'none',
    },
    '::-webkit-file-upload-button': {
      '-webkit-appearance': 'button',
      font: 'inherit',
    },
    summary: {
      display: 'list-item',
    },
    'blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre': {
      margin: '0',
    },
    fieldset: {
      margin: '0',
      padding: '0',
    },
    legend: {
      padding: '0',
    },
    'ol, ul, menu': {
      listStyle: 'none',
      margin: '0',
      padding: '0',
    },
    dialog: {
      padding: '0',
    },
    textarea: {
      resize: 'vertical',
    },
    'input::placeholder, textarea::placeholder': {
      // opacity: '1',
      // color: '#9ca3af',
      color: '#6b7280',
      opacity: '1',
    },
    'button, [role="button"]': {
      cursor: 'pointer',
    },
    ':disabled': {
      cursor: 'default',
    },
    'img, svg, video, canvas, audio, iframe, embed, object': {
      display: 'block',
      verticalAlign: 'middle',
    },
    'img, video': {
      maxWidth: '100%',
      height: 'auto',
    },
    '[hidden]': {
      display: 'none',
    },
    '[type="text"], input:where(:not([type])), [type="email"], [type="url"], [type="password"], [type="number"], [type="date"], [type="datetime-local"], [type="month"], [type="search"], [type="tel"], [type="time"], [type="week"], [type="color"], [multiple], textarea, select':
      {
        appearance: 'none',
        backgroundColor: '#fff',
        borderColor: '#6b7280',
        borderWidth: '1px',
        borderRadius: '0px',
        paddingTop: '8px',
        paddingRight: '12px',
        paddingBottom: '8px',
        paddingLeft: '12px',
        fontSize: '16px',
        lineHeight: '24px',
        '--tw-shadow': '0 0 #0000',
      },
    '[type="text"]:focus, input:where(:not([type])):focus, [type="email"]:focus, [type="url"]:focus, [type="password"]:focus, [type="number"]:focus, [type="date"]:focus, [type="datetime-local"]:focus, [type="month"]:focus, [type="search"]:focus, [type="tel"]:focus, [type="time"]:focus, [type="week"]:focus, [type="color"]:focus, [multiple]:focus, textarea:focus, select:focus':
      {
        outline: '2px solid transparent',
        outlineOffset: '2px',
        '--tw-ring-inset': 'var(--tw-empty,)',
        '--tw-ring-offset-width': '0px',
        '--tw-ring-offset-color': '#fff',
        '--tw-ring-color': '#1ea1ff',
        '--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
        '--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
        boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)',
        borderColor: '#1ea1ff',
      },
    '::-webkit-datetime-edit-fields-wrapper': {
      padding: '0',
    },
    '::-webkit-date-and-time-value': {
      minHeight: '24px',
      textAlign: 'inherit',
    },
    '::-webkit-datetime-edit': {
      display: 'inline-flex',
    },
    '::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datetime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-datetime-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-datetime-edit-meridiem-field':
      {
        paddingTop: '0',
        paddingBottom: '0',
      },
    select: {
      backgroundImage:
        'url(\'data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"%3e%3cpath stroke="%236b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/%3e%3c/svg%3e\')',
      backgroundPosition: 'right 8px center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '24px 24px',
      paddingRight: '40px',
      '-webkit-print-color-adjust': 'exact',
      printColorAdjust: 'exact',
    },
    '[multiple], [size]:where(select:not([size="1"]))': {
      backgroundImage: 'initial',
      backgroundPosition: 'initial',
      backgroundRepeat: 'unset',
      backgroundSize: 'initial',
      paddingRight: '12px',
      '-webkit-print-color-adjust': 'unset',
      printColorAdjust: 'unset',
    },
    '[type="checkbox"], [type="radio"]': {
      appearance: 'none',
      padding: '0',
      '-webkit-print-color-adjust': 'exact',
      printColorAdjust: 'exact',
      display: 'inline-block',
      verticalAlign: 'middle',
      backgroundOrigin: 'border-box',
      '-webkit-user-select': 'none',
      userSelect: 'none',
      flexShrink: '0',
      height: '16px',
      width: '16px',
      color: '#1ea1ff',
      backgroundColor: '#fff',
      borderColor: '#6b7280',
      borderWidth: '1px',
      '--tw-shadow': '0 0 #0000',
    },
    '[type="checkbox"]': {
      borderRadius: '0px',
    },
    '[type="radio"]': {
      borderRadius: '100%',
    },
    '[type="checkbox"]:focus, [type="radio"]:focus': {
      outline: '2px solid transparent',
      outlineOffset: '2px',
      '--tw-ring-inset': 'var(--tw-empty,)',
      '--tw-ring-offset-width': '2px',
      '--tw-ring-offset-color': '#fff',
      '--tw-ring-color': '#1ea1ff',
      '--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
      '--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
      boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)',
    },
    '[type="checkbox"]:checked, [type="radio"]:checked': {
      borderColor: 'transparent',
      backgroundColor: 'currentColor',
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
    '[type="checkbox"]:checked': {
      backgroundImage:
        'url(\'data:image/svg+xml,%3csvg viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg"%3e%3cpath d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"/%3e%3c/svg%3e\')',
    },
    '@media (forced-colors: active)': {
      '[type="checkbox"]:checked': {
        appearance: 'auto',
      },
      '[type="radio"]:checked': {
        appearance: 'auto',
      },
      '[type="checkbox"]:indeterminate': {
        appearance: 'auto',
      },
    },
    '[type="radio"]:checked': {
      backgroundImage:
        'url(\'data:image/svg+xml,%3csvg viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg"%3e%3ccircle cx="8" cy="8" r="3"/%3e%3c/svg%3e\')',
    },
    '[type="checkbox"]:checked:hover, [type="checkbox"]:checked:focus, [type="radio"]:checked:hover, [type="radio"]:checked:focus': {
      borderColor: 'transparent',
      backgroundColor: 'currentColor',
    },
    '[type="checkbox"]:indeterminate': {
      backgroundImage:
        'url(\'data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"%3e%3cpath stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h8"/%3e%3c/svg%3e\')',
      borderColor: 'transparent',
      backgroundColor: 'currentColor',
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
    '[type="checkbox"]:indeterminate:hover, [type="checkbox"]:indeterminate:focus': {
      borderColor: 'transparent',
      backgroundColor: 'currentColor',
    },
    '[type="file"]': {
      background: 'unset',
      borderColor: 'inherit',
      borderWidth: '0',
      borderRadius: '0',
      padding: '0',
      fontSize: 'unset',
      lineHeight: 'inherit',
    },
    '[type="file"]:focus': {
      outline: '1px solid ButtonText',
      // outline: '1px auto -webkit-focus-ring-color',
    },
    '::backdrop': {
      '--tw-border-spacing-x': '0',
      '--tw-border-spacing-y': '0',
      '--tw-translate-x': '0',
      '--tw-translate-y': '0',
      '--tw-rotate': '0',
      '--tw-skew-x': '0',
      '--tw-skew-y': '0',
      '--tw-scale-x': '1',
      '--tw-scale-y': '1',
      '--tw-pan-x': '',
      '--tw-pan-y': '',
      '--tw-pinch-zoom': '',
      '--tw-scroll-snap-strictness': 'proximity',
      '--tw-gradient-from-position': '',
      '--tw-gradient-via-position': '',
      '--tw-gradient-to-position': '',
      '--tw-ordinal': '',
      '--tw-slashed-zero': '',
      '--tw-numeric-figure': '',
      '--tw-numeric-spacing': '',
      '--tw-numeric-fraction': '',
      '--tw-ring-inset': '',
      '--tw-ring-offset-width': '0px',
      '--tw-ring-offset-color': '#fff',
      '--tw-ring-color': 'rgb(72 194 255 / 0.5)',
      '--tw-ring-offset-shadow': '0 0 #0000',
      '--tw-ring-shadow': '0 0 #0000',
      '--tw-shadow': '0 0 #0000',
      '--tw-shadow-colored': '0 0 #0000',
      '--tw-blur': '',
      '--tw-brightness': '',
      '--tw-contrast': '',
      '--tw-grayscale': '',
      '--tw-hue-rotate': '',
      '--tw-invert': '',
      '--tw-saturate': '',
      '--tw-sepia': '',
      '--tw-drop-shadow': '',
      '--tw-backdrop-blur': '',
      '--tw-backdrop-brightness': '',
      '--tw-backdrop-contrast': '',
      '--tw-backdrop-grayscale': '',
      '--tw-backdrop-hue-rotate': '',
      '--tw-backdrop-invert': '',
      '--tw-backdrop-opacity': '',
      '--tw-backdrop-saturate': '',
      '--tw-backdrop-sepia': '',
      '--tw-contain-size': '',
      '--tw-contain-layout': '',
      '--tw-contain-paint': '',
      '--tw-contain-style': '',
    },
  },
});
