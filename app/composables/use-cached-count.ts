export function useCachedCount(
  key: MaybeRefOrGetter<string>,
  count: MaybeRefOrGetter<number | undefined>,
  fallback: number,
) {
  const keyRef = toRef(key)
  const countRef = toRef(count)
  const cached = useScopedLocalStorage<number | undefined>(() => `count:${keyRef.value}`, undefined)

  watchImmediate(countRef, value => {
    if (value != null) cached.value = value
  })

  return computed(() => countRef.value ?? cached.value ?? fallback)
}
