import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['app/components/**/*.{vue,ts}', 'app/sw.ts'],
  ignore: ['**/*.d.ts', 'server/utils/*.example.ts'],
  ignoreDependencies: [
    '@iconify-json/*',
    'vue',
    '@vueuse/core',
    '@regle/rules',
    'vitest-environment-nuxt',
    'workbox-core',
    'workbox-expiration',
    'workbox-precaching',
    'workbox-strategies',
  ],
  project: ['**/*.{ts,vue,cjs,mjs}', '!test/fixtures/**', '!test/test-utils/**', '!test/e2e/helpers/**'],
}

export default config
