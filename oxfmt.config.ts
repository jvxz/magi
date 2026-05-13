import { defineConfig } from 'oxfmt'

export default defineConfig({
  arrowParens: 'avoid',
  ignorePatterns: ['**/*.vue'],
  printWidth: 120,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
})
