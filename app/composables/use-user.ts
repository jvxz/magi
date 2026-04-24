import type { User } from 'matrix-js-sdk'
import { toRef } from '@vueuse/core'

export function useUser<Assert = false>(maybeUserOrId: MaybeRefOrGetter<MaybeUserOrId | undefined | null>): Assert extends true ? ComputedRef<User> : ComputedRef<User | null> {
  const userInputRef = toRef(maybeUserOrId)
  const { client } = useMatrixClient()

  const user = computed(() => isNil(userInputRef.value) ? null : client.value.getUser(resolveUserId(userInputRef.value)))

  return user as Assert extends true ? ComputedRef<User> : ComputedRef<User | null>
}
