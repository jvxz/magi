import type { Maybe } from '@regle/core'

import { required, withAsync, withMessage } from '@regle/rules'
import { useQueryClient } from '@tanstack/vue-query'

export const regleUserIdDefs = {
  required: withMessage(required, 'User ID is required'),
  validId: withMessage(isUserId, 'Invalid user ID'),
}

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

export const noSpaces = createRule({
  message: 'No spaces allowed',
  validator: value => {
    if (typeof value === 'string' && value.includes(' ')) return false

    return true
  },
})
