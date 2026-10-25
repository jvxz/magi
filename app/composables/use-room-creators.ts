export function useRoomCreators(roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  return useRoomComputed(roomOrId, getRoomCreators)
}
