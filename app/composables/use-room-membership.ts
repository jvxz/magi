import type { KnownMembership } from 'matrix-js-sdk'

export function useRoomMembership(
  maybeRoomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>,
  maybeUserOrId: MaybeRefOrGetter<MaybeUserOrId | undefined>,
) {
  const member = useRoomMember(maybeRoomOrId, maybeUserOrId)
  return computed(() => member.value?.membership as KnownMembership | undefined)
}
