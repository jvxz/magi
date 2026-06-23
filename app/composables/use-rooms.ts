import type { Room } from 'matrix-js-sdk'
import type { WatchSource } from 'vue'

export interface RoomAxes {
  directRoomIds: ReadonlySet<string>
  inSpaceRoomIds: ReadonlySet<string>
}

export function useRooms(
  predicate: (room: Room, axes: RoomAxes) => boolean,
  opts?: {
    watch?: WatchSource<any> | WatchSource<any>[]
  },
) {
  const { client } = useMatrixClient()
  const { onSync } = useMatrixHooks()

  const rooms = shallowRef<Room[]>([])
  const refresh = () => {
    const directRoomIds = new Set(getDirectRooms(client.value).map(d => d.roomId))
    const inSpaceRoomIds = getInSpaceRoomIds(client.value)

    rooms.value = client.value.getRooms().filter(room => predicate(room, { directRoomIds, inSpaceRoomIds }))
  }

  onSync(refresh)

  if (opts?.watch) {
    watch(opts.watch, refresh)
  }

  return rooms
}
