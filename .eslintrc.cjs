/** @type import('eslint') */
module.exports = {
  root: true,
  /* ask eslint to support global variables */
  env: {
    browser: true,
    node: true,
    es2021: true,
    commonjs: true,
  },
  globals: {},
  extends: [
    /* https://eslint.org/docs/latest/use/configure/configuration-files#using-eslintrecommended */
    'eslint:recommended',
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    /* enable additional rules */
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'quote-props': ['error', 'as-needed'],
  
    // override configuration set by extending "eslint:recommended"
    'no-cond-assign': ['error', 'always'],
  }
}