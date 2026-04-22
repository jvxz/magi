export const isTestMode = () => import.meta.test

export function isAuthMocked() {
  const shouldSkipMiddleware = useCookie('test-flag:skip-auth-middleware')
  const hasMockedAuthData = localStorage.getItem('magi:test:auth')

  return isTestMode() && (shouldSkipMiddleware.value || hasMockedAuthData)
}
