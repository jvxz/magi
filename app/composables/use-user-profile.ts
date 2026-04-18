import { UserEvent } from 'matrix-js-sdk'

export function useUserProfile(userId: MaybeRefOrGetter<string | undefined>) {
  const { client } = useMatrixClient()
  const userIdRef = toRef(userId)

  const user = computed(() => userIdRef.value ? client.value.getUser(userIdRef.value) : undefined)

  const reducedMotion = usePreferredReducedMotion()

  const query = useQuery({
    enabled: () => !!userIdRef.value,
    queryFn: async () => {
      const profile = await client.value.getProfileInfo(userIdRef.value!)

      const avatar_url = resolveAvatarUrl(profile?.avatar_url, { animated: reducedMotion.value !== 'reduce', baseUrl: client.value.getHomeserverUrl() })

      return {
        ...profile,
        avatar_url,
      }
    },
    queryKey: ['userProfile', userIdRef],
  })

  user.value?.on(UserEvent.AvatarUrl, () => query.refetch())
  user.value?.on(UserEvent.DisplayName, () => query.refetch())

  tryOnScopeDispose(() => {
    user.value?.off(UserEvent.AvatarUrl, () => query.refetch())
    user.value?.off(UserEvent.DisplayName, () => query.refetch())
  })

  return query
}
