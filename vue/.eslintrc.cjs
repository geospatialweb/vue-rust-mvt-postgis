module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest-dom/recommended',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: ['.*', '*.config.*', 'node_modules', 'static'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2022,
    project: './tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname
  },
  plugins: ['@typescript-eslint', 'jest-dom', 'testing-library'],
  overrides: [
    {
      extends: ['plugin:testing-library/vue'],
      files: ['src/**/index.test.ts'],
      rules: {
        '@typescript-eslint/unbound-method': 'off'
      }
    }
  ],
  rules: {
    '@typescript-eslint/no-unused-expressions': 'off'
  }
}
