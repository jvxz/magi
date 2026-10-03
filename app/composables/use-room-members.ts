export function useRoomMembers(roomInput: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const room = useRoom(roomInput)

  watchImmediate(room, r => void r?.loadMembersIfNeeded())

  const isLoaded = computed(() => room.value?.membersLoaded() ?? false)
  const members = computed(() => {
    const r = room.value
    return r?.membersLoaded() ? r.getJoinedMembers() : []
  })

  return { isLoaded, members }
}
