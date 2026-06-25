import { KnownMembership } from 'matrix-js-sdk'

export default defineNuxtPlugin({
  parallel: true,
  setup: () => {
    const { bumpRecentRoom, removeRecentRoom } = useRecentRooms()
    const { client } = useMatrixClient()

    const currentRoom = useCurrentRoom()
    const currentSpaceId = useCurrentSpaceId()
    watch(currentRoom, r => {
      if (!r) return

      if (r.getMyMembership() !== KnownMembership.Join) {
        return removeRecentRoom(r.roomId)
      }

      if (isDirectRoom(client.value, r)) {
        return bumpRecentRoom({
          kind: 'direct',
          roomId: r.roomId,
        })
      }

      if (currentSpaceId.value) {
        return bumpRecentRoom({
          kind: 'group',
          roomId: r.roomId,
          spaceId: currentSpaceId.value!,
        })
      }
    })
  },
})
