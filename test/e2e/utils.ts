import type { BrowserContext, BrowserContextOptions, Page } from 'playwright-core'

import { createPage, url } from '@nuxt/test-utils/e2e'

const MOCK_AUTH_KEY = 'magi:test:auth'

export function newPage(options?: BrowserContextOptions) {
  return createPage(undefined, { baseURL: url('/'), ...options })
}

export async function mockLogin(page: Page) {
  return page.addInitScript(k => {
    window.localStorage.setItem(
      k,
      JSON.stringify({
        accessToken: 'fake-token',
        deviceId: 'TEST_DEVICE',
        userId: '@test:localhost',
      }),
    )
  }, MOCK_AUTH_KEY)
}

async function _mockLogout(page: Page, reload = true) {
  await page.addInitScript(k => window.localStorage.removeItem(k), MOCK_AUTH_KEY)
  if (reload) await page.reload()
}

export function setFlag(context: BrowserContext, flag: string, value: any) {
  return context.addCookies([
    {
      name: `test-flag:${flag}`,
      url: url('/'),
      value: JSON.stringify(value),
    },
  ])
}
