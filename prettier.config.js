module.exports = {
  singleQuote: true,
  printWidth: 140,
  arrowParens: 'always',
  trailingComma: 'es5',
  overrides: [
    {
      files: ['.prettierrc', '.rtlcssrc'],
      options: { parser: 'json' },
    },
  ],
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx', 'twMerge', 'twJoin'],
};
