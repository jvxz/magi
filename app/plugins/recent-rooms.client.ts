export default defineNuxtPlugin({
  parallel: true,
  setup: () => {
    const { bumpRecentRoom } = useRecentRooms()

    const currentRoom = useCurrentRoom()
    const currentSpaceId = useCurrentSpaceId()
    watch(currentRoom, r => {
      if (r)
        bumpRecentRoom(r, {
          isSpace: r.isSpaceRoom(),
          parentSpaceId: currentSpaceId.value,
        })
    })
  },
})
