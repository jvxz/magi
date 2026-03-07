import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(antfu({
  formatters: true,
  rules: {
    'antfu/curly': ['off'],
    'curly': ['warn', 'multi-or-nest'],
    'node/prefer-global/buffer': 'off',
    'node/prefer-global/process': 'off',
    'perfectionist/sort-objects': 'warn',
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': ['warn', {
      multiline: {
        max: 1,
      },
      singleline: {
        max: 2,
      },
    }],
    'vue/no-multiple-template-root': 'off',
    'vue/sort-keys': 'warn',
  },
  typescript: true,
  unocss: true,
  vue: true,
}))
