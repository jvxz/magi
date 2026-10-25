import type { Room, RoomState } from 'matrix-js-sdk'

export function useRoomState(roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const room = useRoom(roomOrId)
  const roomState = shallowRef<RoomState>()
  const { onRoomStateEvents, onRoomTimelineReset } = useMatrixHooks()

  const refresh = (room: Room | undefined) => {
    roomState.value = room && getCurrentRoomState(room)
    triggerRef(roomState)
  }

  watchImmediate(room, refresh)

  onRoomStateEvents((_, s) => {
    if (s.roomId === room.value?.roomId) refresh(room.value)
  })
  onRoomTimelineReset(r => {
    if (r?.roomId === room.value?.roomId) refresh(room.value)
  })

  return roomState
}
