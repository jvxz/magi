import type { ConfigOptions } from '@nuxt/test-utils/playwright'
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'

export default defineConfig<ConfigOptions>({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  testDir: './test/e2e',
  use: {
    nuxt: {
      nuxtConfig: {
        // @ts-expect-error - nitro config is not typed
        nitro: { preset: 'node-server' },
        runtimeConfig: {
          public: {
            testMode: true,
          },
        },
      },
      rootDir: fileURLToPath(new URL('.', import.meta.url)),
    },
    trace: 'on-first-retry',
  },
  workers: process.env.CI ? 1 : undefined,
})
