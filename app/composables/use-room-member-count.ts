import { KnownMembership } from 'matrix-js-sdk'

export function useRoomMemberCount(roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const room = useRoom(roomOrId)
  const count = shallowRef(room.value?.getJoinedMemberCount() ?? undefined)
  const { onRoomMembership } = useMatrixHooks()

  const update = () => (count.value = room.value?.getJoinedMemberCount() ?? undefined)

  onRoomMembership(async (event, member, oldMembership) => {
    if (member.roomId === room.value?.roomId) {
      const { type } = parseMembershipEvent(event)
      if (type === 'join') count.value = (count.value ?? 0) + 1
      else if (type === 'leave' || type === 'kick') count.value = (count.value ?? 0) - 1
      else if (type === 'ban' && oldMembership === KnownMembership.Join) count.value = (count.value ?? 0) - 1
      else update()
    }
  })
  watch(room, update)

  return count
}
