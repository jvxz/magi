import type { EventTimelineSet, Listener, MatrixEvent, Room, RoomEmittedEvents, RoomEventHandlerMap, RoomMember, RoomState } from 'matrix-js-sdk'
import { toRef } from '@vueuse/core'
import { RoomEvent, RoomStateEvent } from 'matrix-js-sdk'

type EmitterListener<T extends RoomEmittedEvents> = Listener<RoomEmittedEvents, RoomEventHandlerMap, T>

type Params = Partial<{
  onTimeline: (event: MatrixEvent) => void
  onTimelineRefresh: (room: Room, eventTimelineSet: EventTimelineSet) => void
  onTimelineReset: (room: Room | undefined, eventTimelineSet: EventTimelineSet, resetAllTimelines: boolean) => void
  onCurrentStateUpdated: (room: Room, previousRoomState: RoomState, roomState: RoomState) => void
  onAccountData: (event: MatrixEvent, room: Room, prevEvent?: MatrixEvent | undefined) => void
  onMemberUpdate: (event: MatrixEvent, state: RoomState, member: RoomMember) => void
  onRoomMemberTyping: (event: MatrixEvent, member: RoomMember) => void
  onMembers: (event: MatrixEvent, state: RoomState, member: RoomMember) => void
}>

export function useRoomEventHooks(roomInput: MaybeRefOrGetter<MaybeRoomOrId | undefined>, params?: Params) {
  const roomInputRef = toRef(roomInput)
  const room = useRoom(roomInputRef)

  const disposers: (() => void)[] = []
  const cleanup = () => disposers.forEach(disposer => disposer())

  watch(room, () => {
    cleanup()

    bindListener(RoomEvent.Timeline, params?.onTimeline, disposers, room.value)
    bindListener(RoomEvent.TimelineRefresh, params?.onTimelineRefresh, disposers, room.value)
    bindListener(RoomEvent.TimelineReset, params?.onTimelineReset, disposers, room.value)
    bindListener(RoomEvent.CurrentStateUpdated, params?.onCurrentStateUpdated, disposers, room.value)
    bindListener(RoomStateEvent.Members, params?.onMemberUpdate, disposers, room.value)
    bindListener(RoomEvent.AccountData, params?.onAccountData, disposers, room.value)
    bindListener(RoomStateEvent.Members, params?.onMembers, disposers, room.value)
  }, { immediate: true })

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
