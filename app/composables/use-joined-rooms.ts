export function useJoinedRooms(_spaceId: MaybeRefOrGetter<string | undefined>) {
  const spaceId = toRef(_spaceId)
  const { client } = useMatrixClient()

  const room = useRoom(spaceId)

  return computed(() => {
    if (!room.value)
      return []

    return getJoinedRooms(client.value, room.value)
  })
}
