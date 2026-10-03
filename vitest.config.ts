import { defineVitestProject } from '@nuxt/test-utils/config'
import { playwright } from '@vitest/browser-playwright'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
    },
    projects: [
      {
        test: {
          environment: 'node',
          include: ['test/unit/*.{test,spec}.ts'],
          name: 'unit',
        },
      },
      {
        resolve: {
          alias: { '~': fileURLToPath(new URL('./app', import.meta.url)) },
        },
        test: {
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: 'chromium' }],
            provider: playwright(),
          },
          include: ['test/browser/**/*.{test,spec}.ts'],
          name: 'browser',
          sequence: { groupOrder: 1 },
        },
      },
      {
        test: {
          environment: 'node',
          hookTimeout: 120_000,
          include: ['test/e2e/**/*.{test,spec}.ts'],
          name: 'e2e',
          setupFiles: ['test/e2e/setup.ts'],
          testTimeout: 30_000,
        },
      },
      await defineVitestProject({
        test: {
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              domEnvironment: 'happy-dom',

              mock: {
                indexedDb: true,
              },
              rootDir: fileURLToPath(new URL('.', import.meta.url)),
            },
          },
          include: ['test/nuxt/**/*.{test,spec}.ts'],
          name: 'nuxt',
          setupFiles: ['vitest-localstorage-mock'],
        },
      }),
    ],
  },
})
