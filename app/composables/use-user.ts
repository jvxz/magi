import { ClientEvent } from 'matrix-js-sdk'

export function useUser() {
  const { client } = useMatrixClient()

  const { data: me, execute: forceRefreshMe, pending: mePending } = useAsyncData(() => `userInfo:${client.value.getUserId()}`, async () => {
    const id = client.value.getUserId()!
    const user = client.value.getUser(id)
    const profile = await client.value.getProfileInfo(id)

    return {
      ...user,
      avatarUrl: profile.avatar_url ?? user?.avatarUrl,
      displayName: profile.displayname ?? user?.displayName,
    }
  }, {
    immediate: false,
  })
  const refreshMe = useThrottleFn(forceRefreshMe, 60000)

  const getAvatarUrl = (userId: MaybeRefOrGetter<'self' | string & {}>) => useAsyncData(() => `userAvatar:${userId}`, async () => {
    const id = userId === 'self' ? client.value.getSafeUserId() : toValue(userId)

    const { avatar_url } = await client.value.getProfileInfo(id, 'avatar_url')
    if (!avatar_url)
      return

    return mxcToHttps(avatar_url, {
      allowDirectLinks: false,
      allowRedirects: true,
      baseUrl: client.value.getHomeserverUrl(),
      height: 32,
      resizeMethod: 'scale',
      useAuthentication: true,
      width: 32,
    })
  }, {
    getCachedData: getClientData,
    immediate: true,
    watch: [() => toValue(userId)],
  })

  // watch client user for updates
  onMounted(() => {
    client.value.on(ClientEvent.Sync, () => refreshMe())

    onScopeDispose(() => {
      client.value.off(ClientEvent.Sync, () => refreshMe())
    })
  })

  return {
    forceRefreshMe,
    getAvatarUrl,
    me,
    mePending,
    refreshMe,
  }
}
