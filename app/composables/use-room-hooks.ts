import type { Listener, MatrixEvent, Room, RoomEmittedEvents, RoomEventHandlerMap, RoomMember } from 'matrix-js-sdk'
import { toRef } from '@vueuse/core'
import { RoomEvent, RoomStateEvent } from 'matrix-js-sdk'

type EmitterListener<T extends RoomEmittedEvents> = Listener<RoomEmittedEvents, RoomEventHandlerMap, T>

type Params = Partial<{
  onTimeline: EmitterListener<RoomEvent.Timeline>
  onTimelineRefresh: EmitterListener<RoomEvent.TimelineRefresh>
  onTimelineReset: EmitterListener<RoomEvent.TimelineReset>
  onCurrentStateUpdated: EmitterListener<RoomEvent.CurrentStateUpdated>
  onAccountData: EmitterListener<RoomEvent.AccountData>
  onMemberUpdate: EmitterListener<RoomStateEvent.Members>
  onRoomMemberTyping: (event: MatrixEvent, member: RoomMember) => void
  onSummary: EmitterListener<RoomEvent.Summary>
}>

export function useRoomHooks(roomInput: MaybeRefOrGetter<MaybeRoomOrId | undefined>, params?: Params) {
  const roomInputRef = toRef(roomInput)
  const room = useRoom(roomInputRef)

  const disposers: (() => void)[] = []
  const cleanup = () => disposers.forEach(disposer => disposer())

  watch(
    room,
    room => {
      cleanup()

      bindListener(RoomEvent.Timeline, params?.onTimeline, disposers, room)
      bindListener(RoomEvent.TimelineRefresh, params?.onTimelineRefresh, disposers, room)
      bindListener(RoomEvent.TimelineReset, params?.onTimelineReset, disposers, room)
      bindListener(RoomEvent.CurrentStateUpdated, params?.onCurrentStateUpdated, disposers, room)
      bindListener(RoomStateEvent.Members, params?.onMemberUpdate, disposers, room)
      bindListener(RoomEvent.AccountData, params?.onAccountData, disposers, room)
      bindListener(RoomEvent.Summary, params?.onSummary, disposers, room)
    },
    { immediate: true },
  )

  if (params?.onRoomMemberTyping) {
    const handler = params.onRoomMemberTyping
    const { off } = roomMemberTypingHook.on((event, member) => {
      if (member.roomId !== room.value?.roomId) return
      handler(event, member)
    })
    onScopeDispose(off)
  }

  onScopeDispose(cleanup)
}

function bindListener<T extends RoomEmittedEvents>(
  event: T,
  listener: EmitterListener<T> | undefined,
  disposers: (() => void)[],
  room: Room | undefined,
) {
  if (!room || !listener) return

  room.on<T>(event, listener)

  disposers.push(() => {
    if (room) room.off<T>(event, listener)
  })
}
