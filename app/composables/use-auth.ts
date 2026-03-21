import type { ICreateClientOpts, LoginRequest as MatrixLoginRequest } from 'matrix-js-sdk'
import { createClient } from 'matrix-js-sdk'

type AuthPayload = Pick<ICreateClientOpts, 'baseUrl' | 'deviceId' | 'refreshToken' | 'userId' | 'accessToken'>

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
  const idb = useIdb()
  const clientStore = useClientStore()

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

      const authedClient = createClient({
        accessToken: loginRes.access_token,
        baseUrl: homeserver,
        deviceId: createDeviceId(userAgent),
        refreshToken: loginRes.refresh_token,
        userId: loginRes.user_id,
      })

      clientStore.client = authedClient
      await idb.setItem('auth', {
        accessToken: loginRes.access_token,
        baseUrl: homeserver,
        deviceId: createDeviceId(userAgent),
        refreshToken: loginRes.refresh_token,
        userId: loginRes.user_id,
      })

      return authedClient
    }
    catch (error) {
      throw new Error(parseMatrixError(error, { fallbackMessage: 'An unexpected error occurred' }))
    }
  }

  async function loginPersisted() {
    const auth = await idb.getItem<AuthPayload>('auth')
    if (!auth)
      return

    const client = createClient({
      ...auth,
      tokenRefreshFunction: async (refreshToken) => {
        const res = await client.refreshToken(refreshToken)

        return {
          accessToken: res.access_token,
          expiry: res.expires_in_ms
            ? new Date(Date.now() + res.expires_in_ms)
            : undefined,
          refreshToken: res.refresh_token,
        }
      },
    })

    return client
  }

  async function logout() {
    await idb.removeItem('auth')
    const clientStore = useClientStore()
    clientStore.$reset()

    return reloadNuxtApp({ path: '/login' })
  }

  return {
    login,
    loginPersisted,
    logout,
  }
}
