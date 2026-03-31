import type { ICreateClientOpts, LoginRequest as MatrixLoginRequest } from 'matrix-js-sdk'
import { createClient } from 'matrix-js-sdk'

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
  const { initAuthedClient } = useMatrixClient()
  const status = useMatrixStatus()

  async function login(req: LoginRequest) {
    try {
      const homeserver = await resolveBaseUrl(withHttps(req.baseUrl))

      const tempClient = createClient({
        baseUrl: homeserver,
      })

      const loginRes = await tempClient.loginRequest({
        ...req,
        refresh_token: true,
      })

      const authPayload: AuthPayload = {
        accessToken: loginRes.access_token,
        baseUrl: homeserver,
        deviceId: loginRes.device_id,
        expiresAt: loginRes.expires_in_ms ? Date.now() + loginRes.expires_in_ms : undefined,
        refreshToken: loginRes.refresh_token,
        userId: loginRes.user_id,
      }
      await idb.setItem<AuthPayload>('auth', authPayload)

      const authedClient = await initAuthedClient(false)
      status.value.isAuthed = true

      return authedClient
    }
    catch (error) {
      sendSessionToSw()
      throw new Error(parseMatrixError(error, { fallbackMessage: 'An unexpected error occurred' }))
    }
  }

  return {
    login,
  }
}

async function sendSessionToSw(baseUrl?: string, accessToken?: string) {
  await messageSw('session', {
    accessToken,
    baseUrl,
  })
}
