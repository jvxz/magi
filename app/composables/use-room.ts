import { toRef } from '@vueuse/core'
import { Room } from 'matrix-js-sdk'

export function useRoom(roomInput: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const inputRef = toRef(roomInput)
  const { client } = useMatrixClient()
  const { revisions } = useRoomRevisions()

  const roomState = computed(() => {
    const input = toValue(inputRef)
    if (!input) return { revision: undefined, room: undefined }

    const revision = revisions.get(resolveRoomId(input))

    if (input instanceof Room) return { revision, room: markRaw(input) }

    const cachedRoom = getRoom(client.value, input)
    return { revision, room: cachedRoom ? markRaw(cachedRoom) : undefined }
  })

  return toRef(() => roomState.value.room)
}
