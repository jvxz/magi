import { KnownMembership } from 'matrix-js-sdk'

export function useRoomIsJoined(roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const room = useRoom(roomOrId)
  const { self } = useSelf()

  const membership = useRoomMembership(room, () => self.value?.userId)

  return computed(() => membership.value === KnownMembership.Join)
}
