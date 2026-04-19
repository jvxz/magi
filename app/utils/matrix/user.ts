// https://github.com/cinnyapp/cinny/blob/098684973ebb28592158efa43e79741ab27afab9/src/app/utils/matrix.ts#L26
export const USER_ID_REG = /^([@$+#])([^\s:]+):(\S+)$/

export function getDisplayNameFallback(userId: string) {
  return userId.match(USER_ID_REG)?.at(2)
}

export function resolveAvatarUrl(avatarUrl: string | undefined, opts?: Partial<{ baseUrl?: string, animated?: boolean }>) {
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
