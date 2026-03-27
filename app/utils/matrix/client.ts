import type { MatrixClient, TokenRefreshFunction } from 'matrix-js-sdk'
import { createClient as _createClient, IndexedDBCryptoStore, IndexedDBStore, MatrixError, TokenRefreshLogoutError } from 'matrix-js-sdk'

export async function createAuthedClient(auth: AuthPayload) {
  const idbStore = new IndexedDBStore({
    dbName: 'matrix',
    indexedDB,
    localStorage,
  })

  const idbCryptoStore = new IndexedDBCryptoStore(indexedDB, 'matrix-crypto')

  const client = _createClient({
    accessToken: auth.accessToken,
    baseUrl: auth.baseUrl,
    cryptoStore: idbCryptoStore,
    deviceId: auth.deviceId,
    store: idbStore,
    timelineSupport: true,
    tokenRefreshFunction: createTokenRefreshFunction(),
    userId: auth.userId,
  })

  await idbStore.startup()

  await client.initRustCrypto()
  client.setMaxListeners(50)

  return client
}

function createTokenRefreshFunction(): TokenRefreshFunction {
  return async (refreshToken: string) => {
    try {
      const auth = await idb.getItem<AuthPayload>('auth')
      if (!auth)
        throw new TokenRefreshLogoutError()

      const tempClient = createTempClient(withHttps(auth.baseUrl), {
        accessToken: auth.accessToken,
        refreshToken,
      })
      const refreshed = await tempClient.refreshToken(refreshToken)

      const expiresAt = refreshed.expires_in_ms ? Date.now() + refreshed.expires_in_ms : undefined

      const payload = {
        ...auth,
        accessToken: refreshed.access_token,
        expiresAt,
        refreshToken: refreshed.refresh_token,
      }
      await idb.setItem<AuthPayload>('auth', payload)
      await messageSw('session', {
        accessToken: payload.accessToken,
        baseUrl: payload.baseUrl,
      })

      return {
        accessToken: refreshed.access_token,
        expiry: expiresAt ? new Date(expiresAt) : undefined,
        refreshToken: refreshed.refresh_token,
      }
    }
    catch (error) {
      if (error instanceof TokenRefreshLogoutError)
        throw error
      if (error instanceof MatrixError) {
        if (error.isRateLimitError())
          throw error
        if (error.errcode === 'M_UNKNOWN_TOKEN') {
          console.error('Unknown refresh token. Client will be unable to refresh')
          throw new TokenRefreshLogoutError()
        }
        throw error
      }
      throw error
    }
  }
}

export async function logoutClient(client: MatrixClient) {
  await messageSw('session', {})
  await messageSw('cache', {
    action: 'evict',
    cacheName: 'media',
    urls: 'all',
  })

  client.stopClient()

  await client.logout().catch(() => {})

  await client.clearStores()
  await idb.clear()

  return reloadNuxtApp({ path: '/' })
}
