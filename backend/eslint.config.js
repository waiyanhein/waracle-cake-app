const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-plugin-prettier');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = [
  {
    ignores: ['node_modules', 'dist'], // ✅ replaces .eslintignore
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.ts'],
    plugins: {
      prettier,
      'unused-imports': unusedImports, // ✅ THIS LINE IS CRITICAL
    },
    rules: {
      'prettier/prettier': 'error',
      'unused-imports/no-unused-imports': 'error', // ✅ now works
    },
  },
];