import type { VNodeChild } from 'vue'

import { mountSuspended } from '@nuxt/test-utils/runtime'

export async function withSetup<T>(setup: () => T, render: () => VNodeChild = () => null) {
  let result!: T
  await mountSuspended(
    defineComponent({
      setup() {
        result = setup()
        return render
      },
    }),
  )
  return result
}
