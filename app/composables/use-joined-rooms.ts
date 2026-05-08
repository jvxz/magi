import type { Room } from 'matrix-js-sdk'

export const useJoinedRooms = createGlobalState(() => {
  const { client } = useMatrixClient()
  const joinedRooms = shallowRef<Set<Room['roomId']>>(new Set())

  const refresh = debounce(async () => {
    const rooms = await client.value.getJoinedRooms()
    joinedRooms.value = new Set(rooms.joined_rooms)
  }, 100)

  watch(client, refresh, { immediate: true })

  return readonly(joinedRooms)
})
