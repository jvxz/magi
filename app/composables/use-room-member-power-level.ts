export function useRoomMemberPowerLevel(roomId: MaybeRefOrGetter<MaybeRoomOrId | undefined>, maybeUserOrId: MaybeRefOrGetter<MaybeUserOrId | undefined>) {
  const roomMember = useRoomMember(roomId, maybeUserOrId)

  return computed(() => roomMember.value?.powerLevel)
}
