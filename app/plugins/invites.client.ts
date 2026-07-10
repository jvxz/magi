export default defineNuxtPlugin({
  parallel: true,
  setup: () => {
    const { client } = useMatrixClient()
    const { handleMembershipUpdate } = useInvites()
    const { onMyMembership, onRoom } = useMatrixHooks()

    onMyMembership(handleMembershipUpdate)
    onRoom(roomOrId => {
      const room = isString(roomOrId) ? client.value.getRoom(roomOrId) : roomOrId
      if (!room) return

      handleMembershipUpdate(room, room.getMyMembership())
    })
  },
})
