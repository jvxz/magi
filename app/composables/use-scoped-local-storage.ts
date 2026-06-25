import type { UseStorageOptions } from '@vueuse/core'

import { pausableFilter } from '@vueuse/core'

export function useScopedLocalStorage<T>(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<T>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>
export function useScopedLocalStorage<T = unknown>(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<T>,
  options?: UseStorageOptions<T>,
): RemovableRef<T> {
  const { self } = useSelf()

  const filter = pausableFilter(undefined, { initialState: 'paused' })

  const storageRef = useLocalStorage<T>(() => `${self.value?.userId}:${toValue(key)}`, initialValue, {
    eventFilter: filter.eventFilter,
    writeDefaults: false,
    ...options,
  } as UseStorageOptions<T>)

  watchImmediate(
    () => !!self.value?.userId,
    exists => filter[exists ? 'resume' : 'pause'](),
  )

  return storageRef
}
