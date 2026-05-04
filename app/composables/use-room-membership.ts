import type { KnownMembership } from 'matrix-js-sdk'

export function useRoomMembership(maybeRoomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>, maybeUserOrId: MaybeRefOrGetter<MaybeUserOrId | undefined>) {
  const room = useRoom(maybeRoomOrId)
  const user = useUser(maybeUserOrId)
  const membership = shallowRef<KnownMembership | undefined>(getMembership())

  useRoomEventHooks(maybeRoomOrId, {
    onMembers: (_event, _state, member) => {
      if (member.userId === user.value?.userId)
        membership.value = member.membership as KnownMembership
    },
  })

  watch([room, user], () => membership.value = getMembership())

  function getMembership() {
    return user.value?.userId ? room.value?.getMember(user.value?.userId)?.membership as KnownMembership : undefined
  }

  return membership
}
