import type { Room } from 'matrix-js-sdk'

export function useRoom(_roomId: MaybeRefOrGetter<string | undefined>) {
  const roomId = () => toValue(_roomId)
  const { client } = useMatrixClient()
  const { onSync } = useMatrixHooks()

  const room = shallowRef<Room | undefined>(undefined)
  const get = () => room.value = client.value.getRoom(roomId()) ?? undefined

  watch(roomId, get, { immediate: true })

  onSync(get)

  return room
}
