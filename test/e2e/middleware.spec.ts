import { expect, test } from '@nuxt/test-utils/playwright'
import { mockLogin } from './utils'

test.describe('Middleware', () => {
  test('redirect to login when unauthenticated', async ({ page }) => {
    await page.goto('/app', { waitUntil: 'load' })
    await expect.poll(() => page.url(), { timeout: 5000 }).toContain('/login')
  })

  test('redirect to app when authenticated', async ({ page }) => {
    await mockLogin(page)

    await page.goto('/login', { waitUntil: 'load' })
    await expect.poll(() => page.url(), { timeout: 5000 }).toContain('/app')
  })
})
