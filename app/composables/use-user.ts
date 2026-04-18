import { toRef } from '@vueuse/core'
import { User } from 'matrix-js-sdk'

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

  const getAvatarUrl = (user: MaybeRefOrGetter<'self' | string & {} | User | undefined>, opts?: MaybeRefOrGetter<GetUserAvatarUrlOpts>) => useQuery({
    enabled: () => !!toValue(user),
    queryFn: () => {
      const value = toValue(user)
      if (!value)
        return undefined

      const optsValue = toValue(opts)

      if (value instanceof User)
        return getUserAvatarUrl(client.value, value.userId, optsValue)

      return getUserAvatarUrl(client.value, value, optsValue)
    },
    queryKey: ['userAvatar', () => toValue(user)],
    watch: [toRef(opts)],
  })

  return {
    forceRefreshMe,
    getAvatarUrl,
    me,
    mePending,
    refreshMe,
  }
}
