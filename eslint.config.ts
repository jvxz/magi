import { antfu } from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  await antfu({
    formatters: false,
    ignores: ['.pnpm-store/', '*.md', 'oxlint.config.ts', 'oxfmt.config.ts'],
    imports: false,
    rules: {
      'node/prefer-global/buffer': 'off',
      'node/prefer-global/process': 'off',
      'perfectionist/sort-objects': 'warn',
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': [
        'warn',
        {
          multiline: {
            max: 1,
          },
          singleline: {
            max: 2,
          },
        },
      ],
      'vue/no-multiple-template-root': 'off',
      'vue/sort-keys': 'warn',
    },
    stylistic: false,
    typescript: true,
    unocss: true,
    vue: true,
  }),
).append(
  // oxfmt owns package.json key ordering (conventional npm order)
  { files: ['package.json'], rules: { 'jsonc/sort-keys': 'off' } },
  ...oxlint.configs['flat/correctness'],
  ...oxlint.configs['flat/suspicious'],
  ...oxlint.configs['flat/typescript'],
  ...oxlint.configs['flat/unicorn'],
  ...oxlint.configs['flat/import'],
  ...oxlint.configs['flat/eslint'],
  ...oxlint.configs['flat/style'],
  ...oxlint.configs['flat/vue'],
)
