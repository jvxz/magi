import { AutoDiscovery, AutoDiscoveryAction } from 'matrix-js-sdk'

export async function checkHomeserver(homeserver: string) {
  if (parseURL(homeserver).host === parseURL(MATRIX_BASE_URL).host)
    return true

  const res = await AutoDiscovery.fromDiscoveryConfig({
    'm.homeserver': { base_url: withHttps(homeserver) },
  })

  if (res['m.homeserver'].state === AutoDiscoveryAction.SUCCESS)
    return true

  if (typeof res['m.homeserver'].error === 'string') {
    const msg = res['m.homeserver'].error
    if (msg.includes('does not appear'))
      throw new Error('Invalid homeserver')

    throw new Error(msg)
  }

  if (res['m.homeserver'].error instanceof Error)
    throw res['m.homeserver'].error

  throw new Error('Unexpected error')
}
