import type { MatrixEvent } from 'matrix-js-sdk'

export const useRoomEventReactionsViewer = createGlobalState(() => {
  const eventRef = shallowRef<MatrixEvent>()
  const roomRef = shallowRef<MaybeRoomOrId>()
  const open = shallowRef(false)

  const currentRoom = useCurrentRoom()
  watch(currentRoom, () => (open.value = false))

  function openReactionViewer(room: MaybeRoomOrId | undefined, event: MatrixEvent | undefined) {
    if (!room || !event) return

    open.value = true
    roomRef.value = room
    eventRef.value = event
  }

  return {
    event: eventRef,
    open,
    openReactionViewer,
    room: roomRef,
  }
})
