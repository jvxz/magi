import { toRef } from '@vueuse/core'
import { Room } from 'matrix-js-sdk'

export function useRoom(roomInput: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const inputRef = toRef(roomInput)
  const { client } = useMatrixClient()
  const versions = useRoomVersions()

  const roomState = computed(() => {
    const input = toValue(inputRef)
    if (!input) return { room: undefined, version: undefined }

    const version = versions.get(resolveRoomId(input))

    if (input instanceof Room) return { room: markRaw(input), version }

    const cachedRoom = getRoom(client.value, input)
    return { room: cachedRoom ? markRaw(cachedRoom) : undefined, version }
  })

  return toRef(() => roomState.value.room)
}
