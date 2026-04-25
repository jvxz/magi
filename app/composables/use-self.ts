import type { User } from 'matrix-js-sdk'
import type { ShallowRef } from 'vue'

export function useSelf() {
  const { client } = useMatrixClient()
  const status = useMatrixStatus()

  const { data: self, isLoading: selfPending, refetch: forceRefreshSelf } = useQuery({
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
  const refreshMe = useThrottleFn(forceRefreshSelf, 60000)

  return {
    forceRefreshSelf,
    refreshMe,
    self: self as ShallowRef<User | undefined>,
    selfPending,
  }
}
