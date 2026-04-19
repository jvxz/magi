import type { IMatrixProfile, User } from 'matrix-js-sdk'
import type { EffectScope, ShallowRef } from 'vue'
import { toRef } from '@vueuse/core'

interface Entry {
  scope: EffectScope
  ref: ShallowRef<IMatrixProfile | undefined>
  subs: number
}

const cache = new Map<string, Entry>()

function acquire(key: string) {
  let entry = cache.get(key)
  if (!entry) {
    const scope = effectScope(true)
    const qc = useQueryClient()

    const ref = scope.run(() => {
      const userId = key
      const { client } = useMatrixClient()
      const { onEvent } = useMatrixHooks()

      const user = shallowRef<User | undefined>(client.value.getUser(userId) ?? undefined)

      const { data: profile } = useQuery({
        initialData: {
          avatar_url: user.value?.avatarUrl,
          displayname: user.value?.rawDisplayName,
        },
        queryFn: () => client.value.getProfileInfo(userId),
        queryKey: getQueryKey(userId),
      })

      onEvent((event) => {
        if (event.getType() !== 'm.room.member')
          return
        if (event.getStateKey() !== userId)
          return

        const content = event.getContent()
        qc.setQueryData<IMatrixProfile>(getQueryKey(userId), (prev) => {
          return {
            ...prev,
            avatar_url: content.avatar_url,
            displayname: content.displayname,
          }
        })
      })

      return profile
    })!

    entry = { ref, scope, subs: 0 }

    cache.set(key, entry)
  }
  entry.subs++
  return entry
}

function release(key: string) {
  const entry = cache.get(key)
  if (!entry)
    return

  entry.subs--

  if (entry.subs <= 0) {
    entry.scope.stop()
    cache.delete(key)
  }
}

export function useUserProfile(userId: MaybeRefOrGetter<string | undefined>) {
  const userIdRef = toRef(userId)
  const current = shallowRef<Entry | undefined>(undefined)

  watch(userIdRef, (key, _, onCleanup) => {
    if (!key) {
      current.value = undefined
      return
    }

    const entry = acquire(key)
    current.value = entry

    onCleanup(() => release(key))
  }, { immediate: true })

  return computed(() => current.value?.ref.value)
}

function getQueryKey(userId: string) {
  return ['userProfile', userId]
}
