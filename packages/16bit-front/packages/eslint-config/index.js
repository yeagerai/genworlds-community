module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    project: ["tsconfig.json"]
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  overrides: [
    {
      files: ['*.js'],
      extends: ['prettier'],
      plugins: ['prettier'],
      rules: {},
    },
    {
      files: ['*.ts'],
      extends: ['airbnb/base', 'airbnb-typescript/base', 'prettier'],
      plugins: ['@typescript-eslint', 'jest', 'prettier'],
      rules: {
        // use single quotes instead double
        quotes: ['error', 'single', { avoidEscape: true }], // allows strings to use single-quotes as long as the string contains a quote that would have to be escaped
        // mark prettier errors as errors
        'prettier/prettier': 'error',
        // mark no-console as error
        'no-console': 'error',
        'import/prefer-default-export': 'off',
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: ['**/*.spec.ts', '**/test/**/*.ts'],
            packageDir: [], // use closest package.json
          },
        ],
        '@typescript-eslint/lines-between-class-members': [
          'error',
          'always',
          { exceptAfterSingleLine: true },
        ],
      },
    },
  ],
};
