import type { ComputedWithControlRef } from '@vueuse/core'
import type { User } from 'matrix-js-sdk'

import { toRef } from '@vueuse/core'

export function useUser<Assert = false>(
  maybeUserOrId: MaybeRefOrGetter<MaybeUserOrId | undefined | null>,
): Assert extends true ? ComputedWithControlRef<User> : ComputedWithControlRef<User | null> {
  const userInputRef = toRef(maybeUserOrId)
  const { client } = useMatrixClient()

  const user = computedWithControl([client, userInputRef], () =>
    isNil(userInputRef.value) ? null : client.value.getUser(resolveUserId(userInputRef.value)),
  )

  return user as Assert extends true ? ComputedWithControlRef<User> : ComputedWithControlRef<User | null>
}
