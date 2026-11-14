import type { IMatrixProfile } from 'matrix-js-sdk'

import { User } from 'matrix-js-sdk'

export const useUserProfileRevisions = createSharedComposable(() => {
  const { client } = useMatrixClient()
  const revisions = shallowReactive(new Map<string, number>())
  const cache = new Map<string, Promise<IMatrixProfile | undefined>>()
  const { onEvent, onUserProfile } = useMatrixHooks()

  const bump = (id: string) => revisions.set(id, (revisions.get(id) ?? 0) + 1)
  const fetchProfile = (id: string) => {
    let profile: Promise<IMatrixProfile | undefined> | undefined = cache.get(id)
    if (!profile) {
      profile = client.value.getProfileInfo(id).catch(() => {
        cache.delete(id)
        return undefined
      })
      cache.set(id, profile)
    }
    return profile
  }

  onEvent(event => {
    if (event.getType() !== 'm.room.member') return

    const userId = event.getStateKey()
    if (!userId) return

    cache.delete(userId)
    bump(userId)
  })

  onUserProfile(userId => {
    cache.delete(userId)
    bump(userId)
  })

  return { fetchProfile, revisions }
})

export function useUserProfile(userInput: MaybeRefOrGetter<MaybeUserOrId | undefined>) {
  const { revisions, fetchProfile } = useUserProfileRevisions()
  const { client } = useMatrixClient()

  const userProfile = shallowRef<IMatrixProfile>({})

  const revision = computed(() => {
    const u = toValue(userInput)
    if (!u) return 0
    return revisions.get(resolveUserId(u)) ?? 0
  })

  watchImmediate([() => toValue(userInput), revision], async ([userOrId], [prevUserOrId]) => {
    if (!userOrId) return (userProfile.value = {})
    const userId = resolveUserId(userOrId)
    const fallback = { displayname: getDisplayNameFallback(userId) }

    const user = userOrId instanceof User ? userOrId : client.value.getUser(userId)
    if (user) return (userProfile.value = { avatar_url: user.avatarUrl, displayname: resolveUserName(user) })

    if (!prevUserOrId || resolveUserId(prevUserOrId) !== userId) userProfile.value = fallback

    let stale = false
    onWatcherCleanup(() => (stale = true))

    const profile = await fetchProfile(userId)
    if (!stale) userProfile.value = profile ?? fallback
  })

  return userProfile
}
