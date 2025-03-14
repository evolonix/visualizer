export const colors = ['green', 'blue', 'purple', 'red', 'yellow', 'neutral', 'green-darker', 'blue-darker'];

export const levelStyles = (color: string, spanLength = 1, gradientColors = [color]) => {
  return {
    color: `var(--mapping-level-text-${color})`,
    ...(spanLength > 1
      ? {
          backgroundImage: `linear-gradient(to right, ${gradientColors
            .map((color, i) => `var(--mapping-level-bg-${color})${i === 0 ? ' 20%' : i === gradientColors.length - 1 ? ' 80%' : ''}`)
            .join(', ')})`,
        }
      : { backgroundColor: `var(--mapping-level-bg-${color})` }),
  };
};
