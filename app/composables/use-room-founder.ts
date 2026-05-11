export function useRoomFounder(roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const room = useRoom(roomOrId)
  const founderId = computed(() => room.value?.getCreator() ?? undefined)
  const founder = useRoomMember(room, founderId)

  whenever(() => !founder.value && !!room.value, () => {
    const r = room.value
    if (!r)
      return
    r.loadMembersIfNeeded().catch(console.error)
  }, { immediate: true })

  return founder
}
