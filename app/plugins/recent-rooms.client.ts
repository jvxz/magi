export default defineNuxtPlugin({
  parallel: true,
  setup: () => {
    const { bumpRecentRoom } = useRecentRooms()
    const { client } = useMatrixClient()

    const currentRoom = useCurrentRoom()
    const currentSpaceId = useCurrentSpaceId()
    watch(currentRoom, r => {
      if (!r) return

      bumpRecentRoom(
        isDirectRoom(client.value, r)
          ? {
              kind: 'direct',
              roomId: r.roomId,
            }
          : {
              kind: 'group',
              roomId: r.roomId,
              spaceId: currentSpaceId.value!,
            },
      )
    })
  },
})
