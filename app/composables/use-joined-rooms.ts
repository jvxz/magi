export function useJoinedRooms(spaceOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const room = useRoom(spaceOrId)
  const { client } = useMatrixClient()

  return computed(() => {
    if (!room.value)
      return []

    return getJoinedRooms(client.value, room.value)
  })
}
