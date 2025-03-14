export const deriveColor = (color: string, transparencyPercent = '100%') => {
  return `rgb(from ${color} r g b / ${transparencyPercent})`;
};
