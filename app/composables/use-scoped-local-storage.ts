import type { RemovableRef, UseStorageOptions } from '@vueuse/core'

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
  return useLocalStorage<T>(() => `${self.value?.userId}:${toValue(key)}`, initialValue, options)
}
