import type { IContent, MatrixEvent } from 'matrix-js-sdk'

export function useEventContent<T extends IContent = IContent>(event: MaybeRefOrGetter<MatrixEvent | undefined>) {
  const eventRef = toRef(event)
  const content = computed(() => eventRef.value?.getContent<T>())
  const isRedacted = computed(() => eventRef.value?.isRedacted())

  return { content, isRedacted }
}
