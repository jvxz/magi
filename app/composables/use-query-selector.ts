/**
 * Reactive query selector
 */
export function useQuerySelector<T extends HTMLElement>(selector: MaybeRefOrGetter<string>) {
  const selectorRef = toRef(selector)
  const element = computed(() => {
    try {
      const selector = selectorRef.value
      if (!selector)
        return

      return document.querySelector<T>(selector)
    }
    catch {
      return undefined
    }
  })

  return element
}
