import type { ConfigOptions } from '@nuxt/test-utils/playwright'
import { defineConfig, devices } from '@playwright/test'

const baseURL = 'http://localhost:5678'

export default defineConfig<ConfigOptions>({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(process.env.CI
          ? { launchOptions: { args: ['--disable-dev-shm-usage'] } }
          : {}),
      },
    },
  ],
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  testDir: './test/e2e',
  use: {
    baseURL,
    nuxt: {
      host: baseURL,
      rootDir: import.meta.dirname,
    },
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm run test:e2e:webserver',
    reuseExistingServer: !process.env.CI,
    url: baseURL,
  },
  workers: process.env.CI ? 1 : undefined,
})
