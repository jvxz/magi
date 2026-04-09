import type { MatrixEvent, Room } from 'matrix-js-sdk'

export const BATCH_SIZE = 120

export function useRoomEvents(room: Ref<Room>) {
  const { client } = useMatrixClient()

  const events = shallowRef<MatrixEvent[]>([])
  const eventVersions = shallowReactive(new Map<string, number>())

  const isFullyLoaded = useState(`${room.value.roomId}:isFullyLoaded`, () => false)

  const sync = () => {
    const liveEvents = room.value.getLiveTimeline().getEvents()

    events.value = [...(liveEvents ?? [])]
  }

  whenever(room, sync, { immediate: true, once: true })

  const mutex = new Mutex()
  const { isPending: isScrolling, mutate: scrollEvents, mutateAsync: scrollEventsAsync, status: scrollEventsStatus } = useMutation({
    mutationFn: async (dir: 'forward' | 'backward') => {
      if (mutex.isLocked)
        return

      await mutex.acquire()
      try {
        const r = toValue(room)
        if (!r)
          return

        // scrolling up; getting older events (maybe not cached)
        if (dir === 'backward') {
          // const canLoadMore = await scrollBack()
          const canLoadMore = await retry(
            scrollBack,
            {
              delay: attempts => attempts * 50,
              retries: 4,
              shouldRetry: err => err instanceof $Error,

            },
          )

          isFullyLoaded.value = !canLoadMore
        }

        sync()
      }
      finally {
        mutex.release()
      }
    },
    mutationKey: ['scrollEvents', () => room.value?.roomId],
  })

  useRoomEventHooks(() => room.value.roomId, {
    onTimeline: () => {
      if (!isScrolling.value)
        sync()
    },
    onTimelineRefresh: () => {
      if (!isScrolling.value)
        sync()
    },
    onTimelineReset: () => {
      if (!isScrolling.value)
        sync()
    },
  })

  const { onDecrypted } = useMatrixHooks()
  onDecrypted((event) => {
    if (room.value.roomId !== event.getRoomId())
      return

    const id = event.getId()
    if (!id)
      return

    eventVersions.set(id, (eventVersions.get(id) ?? 0) + 1)
  })

  function getEventVersion(id: string) {
    return eventVersions.get(id) ?? 0
  }

  async function scrollBack() {
    if (isFullyLoaded.value)
      return false

    const tl = room.value.getLiveTimeline()
    const prevLen = tl.getEvents().length

    const canLoadMore = await client.value.paginateEventTimeline(tl, { backwards: true, limit: BATCH_SIZE })
    const newLen = tl.getEvents().length

    if (prevLen === newLen)
      throw new $Error('previous event length equals new event length')

    return canLoadMore
  }

  return {
    events,
    getEventVersion,
    isFullyLoaded,
    scrollEvents,
    scrollEventsAsync,
    scrollEventsStatus,
  }
}
