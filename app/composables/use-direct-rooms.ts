export function useDirectRooms() {
  const { client } = useMatrixClient()
  const { me } = useUser()
  const { $matrix } = useNuxtApp()

  const asyncData = useAsyncData(() => `directRooms:${me.value?.userId}`, async () => {
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
  }, {
    immediate: true,
    server: false,
    watch: [() => $matrix.status.value.isDataSynced],
  })

  return asyncData
}
