import type { ClientConfig } from 'matrix-js-sdk'

import { AutoDiscovery, AutoDiscoveryAction } from 'matrix-js-sdk'

export async function getHomeserverConfig(homeserver: string) {
  return AutoDiscovery.findClientConfig(withoutProtocol(homeserver))
}

export function isHomeserverValid(config: ClientConfig) {
  const { state } = config['m.homeserver']
  return state !== AutoDiscoveryAction.FAIL_ERROR && state !== AutoDiscoveryAction.FAIL_PROMPT
}
