import type { Room } from 'matrix-js-sdk'
import { UserEvent } from 'matrix-js-sdk'

export function useUserProfile(userId: MaybeRefOrGetter<string | undefined>, room?: MaybeRefOrGetter<Room | undefined>) {
  const { client } = useMatrixClient()
  const userIdRef = toRef(userId)

  const user = computed(() => userIdRef.value ? client.value.getUser(userIdRef.value) : undefined)

  const reducedMotion = usePreferredReducedMotion()

  const query = useQuery({
    enabled: () => !!userIdRef.value,
    queryFn: async () => {
      // user id is guaranteed to be defined as the query is disabled if not
      const userId = userIdRef.value!

      let profile = await client.value.getProfileInfo(userId)

      const r = toValue(room)
      if ((!profile.avatar_url || !profile.displayname) && r) {
        profile = {
          avatar_url: profile.avatar_url ?? r.getMember(userId)?.getMxcAvatarUrl(),
          displayname: profile.displayname ?? getRoomMemberDisplayName(r, userId),
        }
      }

      const resolvedAvatarUrl = resolveAvatarUrl(profile?.avatar_url, { animated: reducedMotion.value !== 'reduce', baseUrl: client.value.getHomeserverUrl() })

      return {
        ...profile,
        avatar_url: resolvedAvatarUrl,
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
