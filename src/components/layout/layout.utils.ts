export const applyTransparency = (
  color?: string,
  transparencyPercent = '100%',
) => {
  if (!color) {
    return undefined;
  }
  return `rgb(from ${color} r g b / ${transparencyPercent})`;
};
