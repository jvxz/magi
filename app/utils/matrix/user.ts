// https://github.com/cinnyapp/cinny/blob/098684973ebb28592158efa43e79741ab27afab9/src/app/utils/matrix.ts#L26
export const USER_ID_REG = /^([@$+#])([^\s:]+):(\S+)$/

export function getDisplayNameFallback(maybeUserOrId: MaybeUserOrId | undefined) {
  if (!maybeUserOrId)
    return 'Unknown user'

  const userId = resolveUserId(maybeUserOrId)

  const match = userId.match(USER_ID_REG)?.at(1)
  assert(match, 'invalid user ID when getting display name fallback')
  return match
}

export function resolveAvatarUrl(avatarUrl: string | undefined, opts?: Partial<{ baseUrl?: string, animated?: boolean, size?: AvatarImageSize } & MxcToHttpsOptions>) {
  if (!avatarUrl)
    return undefined

  const size = opts?.size ? AVATAR_IMAGE_SIZE_VALUES[opts.size] : AVATAR_IMAGE_SIZE_VALUES.medium

  return mxcToHttps(avatarUrl, merge({
    allowDirectLinks: false,
    allowRedirects: true,
    animated: opts?.animated ?? true,
    baseUrl: opts?.baseUrl,
    height: size,
    resizeMethod: 'crop',
    useAuthentication: true,
    width: size,
  }, opts ||= {}))
}

export function resolveUserId(maybeUserOrId: MaybeUserOrId) {
  if (typeof maybeUserOrId === 'string')
    return maybeUserOrId

  return maybeUserOrId.userId
}

export function parseUserId(userId: string | undefined) {
  if (!userId) {
    return {
      homeserver: 'Unknown homeserver',
      name: 'Unknown name',
    }
  }

  const match = userId.match(USER_ID_REG)

  const name = match?.[2]
  assert(name, `failed to get \`name\` when parsing matrix user id: ${userId}`)
  const homeserver = match?.[3]
  assert(homeserver, `failed to get \`homeserver\` when parsing matrix user id: ${userId}`)

  return {
    homeserver,
    name,
  }
}
