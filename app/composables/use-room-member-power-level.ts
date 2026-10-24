export function useRoomMemberPowerLevel(
  roomId: MaybeRefOrGetter<MaybeRoomOrId | undefined>,
  maybeUserOrId: MaybeRefOrGetter<MaybeUserOrId | undefined>,
) {
  const roomMember = useRoomMember(roomId, maybeUserOrId)

  const powerLevel = computed(() => roomMember.value?.powerLevel ?? 0)
  const powerLevelName = computed(() => getPowerLevelName(powerLevel.value))

  return { powerLevel, powerLevelName }
}
