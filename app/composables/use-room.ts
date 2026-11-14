import { toRef } from '@vueuse/core'
import { Room } from 'matrix-js-sdk'

export function useRoom(roomInput: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const inputRef = toRef(roomInput)
  const { client } = useMatrixClient()
  const { revisions } = useRoomRevisions()

  const roomState = computed(() => {
    const input = toValue(inputRef)
    if (!input) return { room: undefined, revision: undefined }

    const revision = revisions.get(resolveRoomId(input))

    if (input instanceof Room) return { room: markRaw(input), revision }

    const cachedRoom = getRoom(client.value, input)
    return { room: cachedRoom ? markRaw(cachedRoom) : undefined, revision }
  })

  return toRef(() => roomState.value.room)
}
