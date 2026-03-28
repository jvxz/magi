import type { Room } from 'matrix-js-sdk'

export function useRooms(_type: MaybeRefOrGetter<'direct' | 'space' | 'all' | 'non-direct'>) {
  const { client } = useMatrixClient()
  const { onSync } = useMatrixHooks()
  const type = () => toValue(_type)

  const get = () => {
    if (type() === 'all')
      return client.value.getRooms()

    const allRooms = client.value.getRooms()
    const directRooms = getDirectRooms(client.value)
    if (!directRooms)
      return

    return allRooms.filter((room) => {
      const isDirect = directRooms.includes(room)
      const isSpace = room.isSpaceRoom()

      if (type() === 'space')
        return isSpace && !isDirect

      if (type() === 'direct')
        return !isSpace && isDirect

      return !isSpace && isDirect
    })
  }

  const rooms = shallowRef<Room[] | undefined>(get())

  onSync(() => rooms.value = get())

  return rooms
}
