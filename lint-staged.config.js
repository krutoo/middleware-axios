module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'prettier --write',
    'eslint --fix --ext .js,.jsx,.ts,.tsx',
  ],
};
