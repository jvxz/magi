import type { test } from '@nuxt/test-utils/playwright'

export type TestArgs = Parameters<Parameters<typeof test.beforeAll>[1]>[0]

const MOCK_AUTH_KEY = 'magi:test:auth'

export async function mockLogin(page: TestArgs['page']) {
  return page.addInitScript((k) => {
    window.localStorage.setItem(k, JSON.stringify({
      accessToken: 'fake-token',
      deviceId: 'TEST_DEVICE',
      userId: '@test:localhost',
    }))
  }, MOCK_AUTH_KEY)
}

export async function mockLogout(page: TestArgs['page'], reload = true) {
  await page.addInitScript(() => window.localStorage.removeItem(MOCK_AUTH_KEY))
  if (reload)
    await page.reload()
}

export function setFlag(context: TestArgs['context'], flag: string, value: any) {
  return context.addCookies([{
    name: `test-flag:${flag}`,
    url: 'http://localhost:5678',
    value: JSON.stringify(value),
  }])
}
