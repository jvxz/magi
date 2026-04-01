import type { Listener, MatrixEvent, Room, RoomEmittedEvents, RoomEventHandlerMap, RoomMember, RoomState } from 'matrix-js-sdk'
import { RoomEvent } from 'matrix-js-sdk'

type EmitterListener<T extends RoomEmittedEvents> = Listener<RoomEmittedEvents, RoomEventHandlerMap, T>

type Params = Partial<{
  onTimeline: (event: MatrixEvent) => void
  onCurrentStateUpdated: (room: Room, previousRoomState: RoomState, roomState: RoomState) => void
  onAccountData: (event: MatrixEvent, room: Room, prevEvent?: MatrixEvent | undefined) => void
  onRoomMemberTyping: (event: MatrixEvent, member: RoomMember) => void
}>

export function useRoomEventHooks(roomId: MaybeRefOrGetter<string | undefined>, params?: Params) {
  const roomIdRef = toRef(roomId)

  const room = useRoom(roomIdRef)

  const disposers: (() => void)[] = []
  const cleanup = () => disposers.forEach(disposer => disposer())

  watch([room], ([current]) => {
    cleanup()

    bindListener(RoomEvent.Timeline, params?.onTimeline, disposers, current)
    bindListener(RoomEvent.CurrentStateUpdated, params?.onCurrentStateUpdated, disposers, current)
    bindListener(RoomEvent.AccountData, params?.onAccountData, disposers, current)
  })

  params?.onRoomMemberTyping && roomMemberTypingHook.on((event, member) => {
    params?.onRoomMemberTyping?.(event, member)
  })

  onScopeDispose(cleanup)
}

function bindListener<T extends RoomEmittedEvents>(event: T, listener: EmitterListener<T> | undefined, disposers: (() => void)[], room: Room | undefined) {
  if (!room || !listener)
    return

  room.on<T>(event, listener)

  disposers.push(() => {
    if (room)
      room.off<T>(event, listener)
  })
}
