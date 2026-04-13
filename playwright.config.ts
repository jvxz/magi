import type { ConfigOptions } from '@nuxt/test-utils/playwright'
import { defineConfig, devices } from '@playwright/test'

const baseURL = 'http://localhost:5678'

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
      host: baseURL,
      nuxtConfig: {
        // @ts-expect-error - nitro config is not typed
        nitro: { preset: 'node-server' },
        runtimeConfig: {
          public: {
            testMode: true,
          },
        },
      },
      rootDir: import.meta.dirname,
    },
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm test:e2e:webserver',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    url: baseURL,
  },
  workers: process.env.CI ? 1 : undefined,
})
