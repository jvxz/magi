import { expect, test } from '@nuxt/test-utils/playwright'

test.beforeEach(async ({ goto, page }) => {
  await page.addInitScript(() => {
    (window as any).__E2E_TEST__ = true

    window.localStorage.setItem('magi:test:auth', JSON.stringify({
      accessToken: 'fake-token',
      deviceId: 'TEST_DEVICE',
      userId: '@test:localhost',
    }))
  })

  await goto('/app/space/123123/123123', { waitUntil: 'hydration' })
})

test('loads page successfully', async ({ goto, page }) => {
  expect(page).toHaveTitle(/Magi/)
})
