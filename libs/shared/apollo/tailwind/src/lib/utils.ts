/**
 * Convert rem to px for the given Tailwind CSS theme
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rem2px(theme: any, fontSize = 16): any {
  if (theme == null) {
    return theme;
  }
  switch (typeof theme) {
    case 'object':
      if (Array.isArray(theme)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return theme.map((val: any) => rem2px(val, fontSize));
      }
      // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-explicit-any
      const ret: Record<string, any> = {};
      for (const key in theme) {
        ret[key] = rem2px(theme[key], fontSize);
      }
      return ret;
    case 'string':
      return theme.replace(/(\d*\.?\d+)rem$/, (_, val) => `${parseFloat(val) * fontSize}px`);
    case 'function':
      return eval(
        theme.toString().replace(
          /(\d*\.?\d+)rem/g,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (_: any, val: any) => `${parseFloat(val) * fontSize}px`
        )
      );
    default:
      return theme;
  }
}
