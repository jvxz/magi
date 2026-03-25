import type { ICreateClientOpts, LoginRequest as MatrixLoginRequest, TokenRefreshFunction } from 'matrix-js-sdk'
import { createClient, MatrixError, TokenRefreshLogoutError } from 'matrix-js-sdk'

export type AuthPayload = Pick<ICreateClientOpts, 'baseUrl' | 'deviceId' | 'refreshToken' | 'userId' | 'accessToken'> & { expiresAt?: number }

interface PasswordLoginRequest extends MatrixLoginRequest {
  type: 'm.login.password'
  identifier: MatrixLoginRequest['identifier']
  token?: never
  password: string
}

interface TokenLoginRequest extends MatrixLoginRequest {
  type: 'm.login.token'
  identifier?: never
  token: string
  password?: never
}

export type LoginRequest = Prettify<PasswordLoginRequest | TokenLoginRequest>

export function useAuth() {
  const { userAgent } = useDevice()
  const { client } = useMatrixClient()
  const { forceRefreshMe } = useUser()

  async function login(req: LoginRequest) {
    try {
      const homeserver = await resolveBaseUrl(withHttps(req.baseUrl))

      const tempClient = createClient({
        baseUrl: homeserver,
      })

      const deviceId = createDeviceId(userAgent)

      const loginRes = await tempClient.loginRequest({
        ...req,
        device_id: deviceId,
        refresh_token: true,
      })

      const authPayload: AuthPayload = {
        accessToken: loginRes.access_token,
        baseUrl: homeserver,
        deviceId,
        expiresAt: loginRes.expires_in_ms ? Date.now() + loginRes.expires_in_ms : undefined,
        refreshToken: loginRes.refresh_token,
        userId: loginRes.user_id,
      }
      await idb.setItem<AuthPayload>('auth', authPayload)

      const authedClient = createClient({
        ...authPayload,
        tokenRefreshFunction: createTokenRefreshFunction(),
      })
      client.value = authedClient

      await client.value.startClient()
      void forceRefreshMe()

      sendSessionToSw(authPayload.baseUrl, authPayload.accessToken)

      return authedClient
    }
    catch (error) {
      sendSessionToSw()
      throw new Error(parseMatrixError(error, { fallbackMessage: 'An unexpected error occurred' }))
    }
  }

  async function loginPersisted() {
    try {
      const auth = await idb.getItem<AuthPayload>('auth')
      if (!auth || !auth.accessToken)
        return

      sendSessionToSw(auth.baseUrl, auth.accessToken)

      return createClient({
        ...auth,
        tokenRefreshFunction: createTokenRefreshFunction(),
      })
    }
    catch (error) {
      console.error('loginPersisted failed', error)
    }
  }

  async function logout() {
    await idb.removeItem('auth')
    const { reset } = useMatrixClient()
    reset()

    await messageSw('cache', {
      action: 'evict',
      cacheName: 'media',
      urls: 'all',
    })

    return reloadNuxtApp({ path: '/login' })
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
            await logout()
            throw new TokenRefreshLogoutError()
          }
          throw error
        }
        throw error
      }
    }
  }

  return {
    login,
    loginPersisted,
    logout,
  }
}

async function sendSessionToSw(baseUrl?: string, accessToken?: string) {
  await messageSw('session', {
    accessToken,
    baseUrl,
  })
}
