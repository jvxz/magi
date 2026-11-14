export const useRoomRevisions = createSharedComposable(() => {
  const revisions = shallowReactive(new Map<string, number>())
  const {
    onRoom,
    onRoomLocalEchoUpdated,
    onRoomMyMembership,
    onRoomName,
    onRoomReceipt,
    onRoomRedaction,
    onRoomStateUpdate,
    onRoomTags,
    onRoomTimeline,
    onRoomTimelineReset,
  } = useMatrixHooks()

  const bump = (id: string) => revisions.set(id, (revisions.get(id) ?? 0) + 1)

  onRoomTimeline((_e, room) => room && bump(room.roomId))
  onRoomTimelineReset(room => room && bump(room.roomId))
  onRoomName(room => bump(room.roomId))
  onRoomReceipt((_e, room) => bump(room.roomId))
  onRoomMyMembership(room => bump(room.roomId))
  onRoomTags((_e, room) => bump(room.roomId))
  onRoomRedaction((_e, room) => bump(room.roomId))
  onRoomLocalEchoUpdated((_e, room) => bump(room.roomId))
  onRoomStateUpdate(state => bump(state.roomId))
  onRoom(room => bump(resolveRoomId(room)))

  const getRevision = (roomOrId: MaybeRoomOrId | undefined) => {
    if (!roomOrId) return -1
    return revisions.get(resolveRoomId(roomOrId)) ?? -1
  }

  return { getRevision, revisions }
})

export function useRoomRevision(roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const roomId = useResolveRoomId(roomOrId)
  const { revisions } = useRoomRevisions()

  return computed(() => {
    if (!roomId.value) return -1
    return revisions.get(roomId.value) ?? -1
  })
}
