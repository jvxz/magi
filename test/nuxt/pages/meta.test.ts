import { describe, expect, it, vi } from 'vitest'
import { LocalStorage } from '../mocks/localstorage.mock'

vi.stubGlobal('localStorage', new LocalStorage(vi))

describe('page meta', () => {
  const routes = {
    '/': undefined,
    '/app': true,
    '/app/space/1234': true,
    '/app/space/1234/1234': true,
    '/app/space/foobar': true,
    '/app/very/very/very/very/very/very/very/long/path': true,
    '/login': undefined,
  }

  it.each(objectKeys(routes))('ensures authed routes have the correct meta flag', async (r) => {
    await navigateTo(r)
    const route = useRoute()

    expect(route.meta.requiresAuth).toBe(routes[r])
  })
})
