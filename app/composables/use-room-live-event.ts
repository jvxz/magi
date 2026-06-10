import type { MatrixEvent } from 'matrix-js-sdk'

export function useRoomLiveEvent(
  roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>,
  eventOrId: MaybeRefOrGetter<MaybeEventOrId | undefined>,
) {
  const room = useRoom(roomOrId)
  const eventId = useResolveEventId(eventOrId)

  const getEvent = () => {
    if (!room.value || !eventId.value) return undefined
    const e = room.value.findEventById(eventId.value)
    return e ? markRaw(e) : undefined
  }

  const event = shallowRef<MatrixEvent | undefined>(getEvent())

  const update = throttle(() => {
    event.value = getEvent()
    triggerRef(event)
  }, 50)

  const isAssociated = (e: MatrixEvent) => (e.getAssociatedId() ?? e.getId()) === eventId.value

  useRoomHooks(room, {
    onTimeline: e => {
      if (isAssociated(e)) update()
    },
    onTimelineRefresh: update,
    onTimelineReset: update,
  })

  const { onDecrypted } = useMatrixHooks()
  onDecrypted(e => {
    if (e.getId() === eventId.value) update()
  })

  watch([room, eventId], update)

  return event
}
