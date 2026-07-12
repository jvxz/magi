const MOCK_AUTH_KEY = 'magi:test:auth'

export const isTestMode = () => import.meta.test

export function getMockedAuth(): AuthPayload | undefined {
  if (import.meta.server || !isTestMode()) return undefined

  const raw = localStorage.getItem(MOCK_AUTH_KEY)
  if (!raw) return undefined

  try {
    return JSON.parse(raw) as AuthPayload
  } catch {
    return undefined
  }
}

export function isAuthMocked() {
  if (import.meta.server) return false

  const shouldSkipMiddleware = useCookie('test-flag:skip-auth-middleware')

  return isTestMode() && (shouldSkipMiddleware.value || !!getMockedAuth())
}
