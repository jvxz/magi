export const useRoomPowerLevels = (roomId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) => {
  const powerLevels = useRoomComputed(roomId, r => (r ? getRoomPowerLevels(r) : undefined))
  const defaultPowerLevel = computed(() => powerLevels.value?.users_default ?? 0)

  return { defaultPowerLevel, powerLevels }
}
