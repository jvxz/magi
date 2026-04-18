export type ResolveAvatarUrlOpts = Partial<{ baseUrl?: string, animated?: boolean }>

export function resolveAvatarUrl(avatarUrl: string | undefined, opts?: ResolveAvatarUrlOpts) {
  if (!avatarUrl)
    return undefined

  return mxcToHttps(avatarUrl, {
    allowDirectLinks: false,
    allowRedirects: true,
    animated: opts?.animated ?? true,
    baseUrl: opts?.baseUrl,
    height: 400,
    resizeMethod: 'scale',
    useAuthentication: true,
    width: 400,
  })
}
