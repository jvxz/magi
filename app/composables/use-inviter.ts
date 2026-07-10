export function useInviter(roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const room = useRoom(roomOrId)
  const { self } = useSelf()

  const inviterId = computed(() => {
    if (!room.value || !self.value) return
    return getInviter(room.value, self.value.userId)
  })

  return useRoomMember(room, inviterId)
}
