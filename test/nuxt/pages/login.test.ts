import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import LoginPage from '~/pages/login/index.vue'
import { $Error, ErrorCode } from '~/utils/error'

const mountPage = async () => mountSuspended(LoginPage)

const { getLoginFlows } = vi.hoisted(() => ({
  getLoginFlows: vi.fn().mockResolvedValue({ flows: [{ type: 'm.login.password' }] }),
}))
mockNuxtImport('getLoginFlows', () => getLoginFlows)

describe('login page', () => {
  it('allows default homeserver', async () => {
    const component = await mountPage()
    await vi.waitFor(() => expect(component.text()).not.toContain('Failed to fetch'))
  })

  it('denies invalid homeserver', async () => {
    window.history.pushState({}, '', '/?homeserver=invalid.example.org')
    getLoginFlows.mockRejectedValueOnce(
      new $Error({ code: ErrorCode.InvalidUrl, message: 'Invalid homeserver', title: 'Failed to fetch' }),
    )

    const component = await mountPage()

    await vi.waitFor(() => expect(component.text()).toContain('Failed to fetch'))
  })
})
