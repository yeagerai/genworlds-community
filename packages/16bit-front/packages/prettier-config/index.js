module.exports = {
  semi: true,
  arrowParens: "always",
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: "all",
  printWidth: 80,
  tabWidth: 2,
  endOfLine: "auto",
  overrides: [
    {
      files: "*.tsx",
      options: {
        printWidth: 100
      }
    }
  ]
};
