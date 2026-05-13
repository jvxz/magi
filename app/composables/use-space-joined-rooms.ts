export function useSpaceJoinedRooms(spaceId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const { client } = useMatrixClient()

  const room = useRoom(spaceId)

  return computed(() => {
    if (!room.value) return []

    return getJoinedRooms(client.value, room.value)
  })
}
