import type { IContent, MatrixEvent } from 'matrix-js-sdk'

export function useEventContent(event: MaybeRefOrGetter<MatrixEvent | undefined>, pick?: keyof IContent, fallback?: string) {
  const eventRef = toRef(event)
  const content = computed(() => {
    if (pick)
      return eventRef.value?.getContent()[pick] ?? fallback

    return eventRef.value?.getContent() ?? fallback
  })

  const isFallback = computed(() => content.value === fallback)

  return {
    content,
    isFallback,
  }
}
