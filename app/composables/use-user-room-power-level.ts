export function useUserRoomPowerLevel(roomId: MaybeRefOrGetter<string | undefined>, maybeUserOrId: MaybeRefOrGetter<MaybeUserOrId | undefined>) {
  const room = useRoom(roomId)
  const user = useUser(maybeUserOrId)

  const powerLevel = computed(() => {
    if (!room.value || !user.value)
      return null

    const roomMember = room.value?.getMember(user.value.userId)

    return roomMember?.powerLevel ?? null
  })

  return powerLevel
}
