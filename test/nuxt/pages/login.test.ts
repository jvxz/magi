import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import LoginPage from '~/pages/login.vue'

const mountPage = async () => mountSuspended(LoginPage)

const { validateHomeserver } = vi.hoisted(() => ({
  validateHomeserver: vi.fn(),
}))
mockNuxtImport('validateHomeserver', () => validateHomeserver)

describe('login page', () => {
  it('allows default homeserver', async () => {
    const component = await mountPage()
    await vi.waitFor(() => expect(component.text()).not.toContain('Invalid homeserver'))
  })

  it('denies invalid homeserver', async () => {
    validateHomeserver.mockRejectedValueOnce('Invalid homeserver')

    const component = await mountPage()

    await vi.waitFor(() => expect(component.text()).toContain('Invalid homeserver'))
  })
})
