export const useIsDirectInvite = (roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) => {
  const { self } = useSelf()
  const room = useRoom(roomOrId)

  return computed(() => isDirectInvite(room.value, self.value?.userId))
}
