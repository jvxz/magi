export function useRoomMember(roomId: MaybeRefOrGetter<string | undefined>, userId: MaybeRefOrGetter<string | undefined>) {
  const userIdRef = toRef(userId)
  const roomIdRef = toRef(roomId)
  const { client } = useMatrixClient()

  const member = computed(() => getMember(client.value, userIdRef.value, roomIdRef.value))

  return member
}
