import type { ClientConfig, LoginFlow } from 'matrix-js-sdk'

import { AutoDiscovery, AutoDiscoveryAction, createClient } from 'matrix-js-sdk'

export async function getHomeserverConfig(homeserver: string) {
  return AutoDiscovery.findClientConfig(withoutProtocol(homeserver))
}

export function isHomeserverValid(config: ClientConfig) {
  const { state } = config['m.homeserver']
  return state !== AutoDiscoveryAction.FAIL_ERROR && state !== AutoDiscoveryAction.FAIL_PROMPT
}

export async function getLoginFlows(homeserver: string) {
  const config = await getHomeserverConfig(homeserver)
  const client = createClient({ baseUrl: config['m.homeserver'].base_url ?? homeserver })
  return client.loginFlows()
}

export function getSSOFlow(loginFlows: LoginFlow[]) {
  return loginFlows.find(f => ['m.login.sso', 'm.login.cas'].includes(f.type))
}

export async function resolveHomeserverBaseUrl(baseUrl: string): Promise<string> {
  try {
    const homeserverConfig = await getHomeserverConfig(baseUrl)

    if (homeserverConfig['m.homeserver'].state !== AutoDiscoveryAction.SUCCESS)
      throw homeserverConfig['m.homeserver']?.error

    return homeserverConfig['m.homeserver'].base_url ?? baseUrl
  } catch (error) {
    throw parseError(error, { fallbackMessage: 'Failed to resolve base URL' }).message
  }
}
