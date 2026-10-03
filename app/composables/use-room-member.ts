export function useRoomMember(
  roomInput: MaybeRefOrGetter<MaybeRoomOrId | undefined>,
  userInput: MaybeRefOrGetter<MaybeUserOrId | undefined>,
) {
  const { client } = useMatrixClient()
  const versions = useRoomStateVersions()

  return toRef(() => {
    const roomOrId = toValue(roomInput)
    const userOrId = toValue(userInput)
    if (!roomOrId || !userOrId) return undefined

    const roomId = resolveRoomId(roomOrId)
    void versions.get(roomId)

    const member = getRoom(client.value, roomId)?.getMember(resolveUserId(userOrId))
    return member ? markRaw(member) : undefined
  })
}
