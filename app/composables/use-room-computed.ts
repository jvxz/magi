import type { Room } from 'matrix-js-sdk'

export function useRoomComputed<T>(room: MaybeRefOrGetter<Room>, getter: (room: Room) => T): ComputedRef<T>
export function useRoomComputed<T>(
  roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>,
  getter: (room: Room | undefined) => T,
): ComputedRef<T>
export function useRoomComputed<T>(roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>, getter: (room: any) => T) {
  const room = useRoom(roomOrId)
  const { revisions } = useRoomRevisions()

  return computed(() => {
    const r = room.value
    if (r) void revisions.get(r.roomId)
    return getter(r)
  })
}
