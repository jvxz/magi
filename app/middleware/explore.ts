export default defineNuxtRouteMiddleware(({ params }) => {
  function getBaseUrl() {
    const baseUrl = 'baseUrl' in params ? params.baseUrl : undefined
    if (!baseUrl)
      return MATRIX_BASE_URL

    if (Array.isArray(baseUrl))
      return baseUrl[0]

    return baseUrl
  }

  const baseUrl = getBaseUrl()
  if (!baseUrl) {
    return navigateTo({
      name: 'explore',
      params: { baseUrl: withoutProtocol(MATRIX_BASE_URL) },
    })
  }

  const { host, pathname, protocol } = parseURL(baseUrl)

  if (pathname)
    return

  if (!host) {
    return navigateTo({
      name: 'explore',
      params: { baseUrl: withoutProtocol(MATRIX_BASE_URL) },
    })
  }

  if (protocol) {
    return navigateTo({
      name: 'explore',
      params: { baseUrl: host },
    })
  }
})
