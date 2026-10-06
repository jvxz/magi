import type { IContent, MatrixEvent } from 'matrix-js-sdk'

import { toRef } from '@vueuse/core'

export function useEventContent<T extends IContent = IContent>(event: MaybeRefOrGetter<MatrixEvent | undefined>) {
  const eventRef = toRef(event)
  const version = computed(() => getEventVersion(eventRef.value?.getId()))

  const content = computed(() => {
    void version.value
    return eventRef.value?.getContent<T>()
  })

  const isEncrypted = computed(() => {
    void version.value
    return eventRef.value?.isEncrypted() ?? false
  })

  const state = computed(() => {
    void version.value
    const event = eventRef.value
    if (!event) return

    if (event.isRedacted()) return 'redacted'
    if (event.isBeingDecrypted()) return 'decrypting'
    if (event.isDecryptionFailure()) return 'decryptionFailure'
  })

  const isRedacted = computed(() => {
    void version.value
    return eventRef.value?.isRedacted()
  })

  return { content, isEncrypted, isRedacted, state }
}
