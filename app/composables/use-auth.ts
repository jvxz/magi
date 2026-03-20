import { createClient } from 'matrix-js-sdk'
import { UAParser } from 'ua-parser-js'

export function useAuth() {
  const { userAgent } = useDevice()

  async function login(opts: {
    username: string
    homeserver: string
    password: string
  }) {
    try {
      const homeserver = withHttps(opts.homeserver)

      const tempClient = createClient({
        baseUrl: homeserver,
      })

      const { getBrowser, getDevice } = new UAParser(userAgent)

      const loginRes = await tempClient.loginRequest({
        device_id: `Decoy on ${getBrowser()} (${getDevice()})`,
        identifier: {
          type: 'm.id.user',
          user: opts.username,
        },
        password: opts.password,
        refresh_token: true,
        type: 'm.login.password',
      })

      const authedClient = createClient({
        accessToken: loginRes.access_token,
        baseUrl: homeserver,
        deviceId: loginRes.device_id,
        refreshToken: loginRes.refresh_token,
        userId: loginRes.user_id,
      })

      return authedClient
    }
    catch (error) {
      throw new Error(parseMatrixError(error, { fallbackMessage: 'An unexpected error occurred' }))
    }
  }

  return {
    login,
  }
}
