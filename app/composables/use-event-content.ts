import type { IContent, MatrixEvent } from 'matrix-js-sdk'

export function useEventContent(event: MatrixEvent | undefined, pick?: keyof IContent) {
  const content = computed(() => {
    if (pick)
      return event?.getContent()[pick]

    return event?.getContent()
  })

  return content
}
