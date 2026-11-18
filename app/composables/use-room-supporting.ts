import type { Room } from 'matrix-js-sdk'

export function useRoomSupporting(
  room: MaybeRefOrGetter<Room | undefined>,
  type: MaybeRefOrGetter<IsRoomSupportingOpts>,
) {
  return useRoomComputed(room, room => {
    if (!room) return false

    const ver = room.getVersion()
    return isRoomSupporting(toValue(type), ver)
  })
}
