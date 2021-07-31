module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  plugins: ['jest', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'linebreak-style': ['error', 'unix'],
  },
};
