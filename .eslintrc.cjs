module.exports = {
  root: true,
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  env: {
    node: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'no-console': 'warn',
    'arrow-parens': ['error', 'as-needed'],
    'react/react-in-jsx-scope': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'max-len': 'off',
    '@typescript-eslint/no-misused-promises': ['error', {
      checksVoidReturn: {
        attributes: false,
      },
    }],
    'object-curly-newline': ['error', {
      ObjectExpression: { consistent: true, multiline: true },
      ObjectPattern: { consistent: true, multiline: true },
      ImportDeclaration: 'never',
      ExportDeclaration: { multiline: true, minProperties: 3 },
    }],
  },
};
