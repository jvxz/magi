export function useRoomEvents(roomId: MaybeRefOrGetter<string | undefined>) {
  const roomIdRef = toRef(roomId)

  const { client } = useMatrixClient()
  const room = useRoom(roomIdRef)

  const events = computedWithControl(room, () => {
    if (!room.value)
      return []

    const tl = room.value.getLiveTimeline()
    return tl.getEvents() ?? []
  })

  watch(events, async (e) => {
    if (room.value && e.length < 30) {
      const tl = room.value.getLiveTimeline()

      await client.value.paginateEventTimeline(tl, {
        backwards: true,
        limit: 30 - e.length,
      })

      events.trigger()
    }
  })

  useRoomEventHooks(roomIdRef, {
    onTimeline: () => events.trigger(),
  })

  return events
}
