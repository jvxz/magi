import { defineVitestProject } from '@nuxt/test-utils/config'
import { playwright } from '@vitest/browser-playwright'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const defineBrowser = () => ({
  enabled: true,
  headless: true,
  instances: [{ browser: 'chromium' as const }],
  provider: playwright(),
})

const nuxtOpts = {
  mock: { indexedDb: true },
  rootDir: fileURLToPath(new URL('.', import.meta.url)),
}

const BROWSER_NUXT_TESTS = 'test/nuxt/components/**/*.{test,spec}.ts'

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
    },
    projects: [
      {
        resolve: {
          alias: { '~': fileURLToPath(new URL('./app', import.meta.url)) },
        },
        test: {
          browser: defineBrowser(),
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
          environmentOptions: { nuxt: { ...nuxtOpts, domEnvironment: 'happy-dom' } },
          exclude: [BROWSER_NUXT_TESTS],
          include: ['test/nuxt/**/*.{test,spec}.ts'],
          name: 'nuxt',
          setupFiles: ['vitest-localstorage-mock', 'test/support/setup.ts'],
          // first mountSuspended in a file imports the whole app, taking ~3-5s
          testTimeout: 15000,
        },
      }),
      await defineVitestProject({
        test: {
          browser: defineBrowser(),
          environment: 'nuxt',
          environmentOptions: { nuxt: nuxtOpts },
          include: [BROWSER_NUXT_TESTS],
          name: 'nuxt-browser',
          setupFiles: ['test/support/setup.ts'],
          testTimeout: 15000,
        },
      }),
    ],
  },
})
