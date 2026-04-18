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

  return {
    forceRefreshMe,
    me,
    mePending,
    refreshMe,
  }
}
