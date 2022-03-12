module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'import/prefer-default-export': 'off',
    'no-template-curly-in-string': 'off',
    'no-param-reassign': [2, {
      'props': false
    }]
  }
};
