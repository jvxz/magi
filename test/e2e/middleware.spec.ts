import { describe, expect, it } from 'vitest'

import { mockLogin, newPage } from './utils'

describe('middleware', () => {
  it('redirect to login when unauthenticated', async () => {
    const page = await newPage()

    await page.goto('/app', { waitUntil: 'load' })
    await expect.poll(() => page.url(), { timeout: 5000 }).toContain('/login')
    await page.close()
  })

  it('redirect to app when authenticated', async () => {
    const page = await newPage()
    await mockLogin(page)

    await page.goto('/login', { waitUntil: 'load' })
    await expect.poll(() => page.url(), { timeout: 5000 }).toContain('/app')
    await page.close()
  })
})
