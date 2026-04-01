import type { MatrixEvent, Room } from 'matrix-js-sdk'

export function useRoomEvents(room: MaybeRefOrGetter<Room | undefined>) {
  const roomRef = toRef(room)
  const { client } = useMatrixClient()

  const events = shallowRef<MatrixEvent[]>(roomRef.value?.getLiveTimeline().getEvents() ?? [])

  const sync = () => {
    const liveEvents = roomRef.value?.getLiveTimeline().getEvents()

    events.value = [...(liveEvents ?? [])]
  }

  watchImmediate(events, async () => {
    if (events.value.length < 30) {
      const tl = roomRef.value?.getLiveTimeline()
      if (!tl)
        return

      const res = await client.value.paginateEventTimeline(tl, {
        backwards: true,
        limit: 30 - events.value.length,
      })

      if (res)
        sync()
    }
  })

  useRoomEventHooks(() => roomRef.value?.roomId, {
    onTimeline: () => sync(),
    onTimelineRefresh: () => sync(),
    onTimelineReset: () => sync(),
  })

  // sync on decrypted events (usually messages)
  const { onDecrypted } = useMatrixHooks()
  onDecrypted(sync)

  return events
}
