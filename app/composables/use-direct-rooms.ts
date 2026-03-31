export function useDirectRooms() {
  const { client } = useMatrixClient()
  const status = useMatrixStatus()

  const asyncState = useAsyncState(async () => {
    const directRooms = getDirectRooms(client.value)

    return await Promise.all(directRooms.map(async (directRoom) => {
      const room = client.value.getRoom(directRoom.roomId)
      if (!room)
        throw new Error(`Direct room ${directRoom.roomId} not found`)

      const avatarUrl = getDirectRoomAvatarUrl({ client: client.value, room, useAuthentication: true })

      return {
        ...room,
        avatarUrl,
      }
    }))
  }, undefined, {
    immediate: true,
  })

  watch(() => status.value.isDataSynced, asyncState.executeImmediate)

  return asyncState
}
