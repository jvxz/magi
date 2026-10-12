export function useRoomMembers(
  roomInput: MaybeRefOrGetter<MaybeRoomOrId | undefined>,
  opts?: {
    sortByPowerlevel?: MaybeRefOrGetter<boolean>
  },
) {
  const { sortByPowerlevel = false } = opts ?? {}

  const room = useRoom(roomInput)

  watchImmediate(room, r => void r?.loadMembersIfNeeded())

  const isLoaded = computed(() => room.value?.membersLoaded() ?? false)
  const members = computed(() => {
    const r = room.value
    if (!r?.membersLoaded()) return []
    return toValue(sortByPowerlevel) ? sortMembersByPowerlevel(r.getJoinedMembers()) : r.getJoinedMembers()
  })

  return { isLoaded, members }
}
