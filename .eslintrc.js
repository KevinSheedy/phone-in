module.exports = {
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
  },
  parser: 'babel-eslint',
    extends: [
    'standard',
    'prettier',
    'prettier/standard'
  ],
};
