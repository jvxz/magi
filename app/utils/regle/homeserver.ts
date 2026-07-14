import type { Maybe } from '@regle/core'

import { withAsync, withMessage } from '@regle/rules'
import { useQueryClient } from '@tanstack/vue-query'

export function getValidHomeserverRule() {
  const queryClient = useQueryClient()

  return withMessage(
    withAsync(async (value: Maybe<string>) => {
      if (!value) return true

      try {
        const config = await queryClient.ensureQueryData({
          queryFn: () => getHomeserverConfig(value),
          queryKey: $qk.homeserverConfig(value).map(toValue),
        })
        return isHomeserverValid(config)
      } catch {
        return false
      }
    }),
    'Invalid homeserver',
  )
}
