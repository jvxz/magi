export function useUser() {
  const { client } = useMatrixClient()
  const status = useMatrixStatus()

  const { data: me, isLoading: mePending, refetch: forceRefreshMe } = useQuery({
    queryFn: async () => {
      const id = client.value.getSafeUserId()
      const user = client.value.getUser(id)
      const profile = await client.value.getProfileInfo(id)

      return {
        ...user,
        avatarUrl: profile.avatar_url ?? user?.avatarUrl,
        displayName: profile.displayname ?? user?.displayName,
      }
    },
    queryKey: ['userInfo', () => client.value.getUserId()],
    watch: [() => status.value.isDataSynced],
  })
  const refreshMe = useThrottleFn(forceRefreshMe, 60000)

  const getAvatarUrl = (userId: MaybeRefOrGetter<'self' | string & {}>) => useQuery({
    queryFn: async () => {
      const id = toValue(userId) === 'self' ? client.value.getSafeUserId() : toValue(userId)

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
    },
    queryKey: ['userAvatar', () => toValue(userId)],
  })

  return {
    forceRefreshMe,
    getAvatarUrl,
    me,
    mePending,
    refreshMe,
  }
}
