import type { MatrixClient } from 'matrix-js-sdk'

export type GetUserAvatarUrlOpts = Partial<{ baseUrl?: string, animated?: boolean }>

export async function getUserAvatarUrl(client: MatrixClient, userId: string, opts?: GetUserAvatarUrlOpts) {
  const id = userId === 'self' ? client.getSafeUserId() : userId

  const { avatar_url } = await client.getProfileInfo(id, 'avatar_url')
  if (!avatar_url)
    return

  return mxcToHttps(avatar_url, {
    allowDirectLinks: false,
    allowRedirects: true,
    animated: opts?.animated ?? true,
    baseUrl: opts?.baseUrl ?? client.getHomeserverUrl(),
    height: 32,
    resizeMethod: 'scale',
    useAuthentication: true,
    width: 32,
  })
}
