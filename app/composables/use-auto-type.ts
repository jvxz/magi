export function useAutoType(element: MaybeRefOrGetter<MaybeElement>) {
  const enabled = ref(true)

  onStartTyping(() => {
    const el = toValue(element)
    if (!el || !(el instanceof HTMLElement)) return

    el.focus()
  })

  return { enabled }
}
