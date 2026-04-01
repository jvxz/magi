export const useCurrentRoomTyping = createSharedComposable(() => {
  const typingMembers = shallowRef<string[]>([])

  roomMemberTypingHook.on(event => typingMembers.value = event.getContent<RoomMemberTypingEventContent>().user_ids)

  onRoomChange((newRoom) => {
    if (!newRoom)
      return typingMembers.value = []

    const members = newRoom.getJoinedMembers()

    const m: string[] = []
    for (const member of members) {
      if (member.typing)
        m.push(member.userId)
    }
    typingMembers.value = m
  })

  return typingMembers
})
