import type { Room } from 'matrix-js-sdk'

export function useRoom(roomId: MaybeRefOrGetter<string | undefined>) {
  const roomIdRef = toRef(roomId)
  const { client } = useMatrixClient()
  const { onSync } = useMatrixHooks()

  const room = shallowRef<Room | undefined>(undefined)
  const get = () => {
    const r = isTestMode() ? createMockRoom(500, roomIdRef.value!) : client.value.getRoom(roomIdRef.value)
    if (r)
      room.value = r

    else room.value = undefined

    triggerRef(room)
  }

  watch(roomIdRef, get, { immediate: true })

  onSync(get)

  return room
}
