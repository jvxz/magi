import type { MatrixEvent, Room } from 'matrix-js-sdk'
import { Direction } from 'matrix-js-sdk'

export const BATCH_SIZE = 120

type Hooks = Prettify<Partial<Pick<Required<NonNullable<Parameters<typeof useRoomEventHooks>[1]>>, 'onTimelineRefresh' | 'onTimeline' | 'onTimelineReset'>>>

export function useRoomEvents(room: Ref<Room>, hooks?: Hooks) {
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
    mutationFn: async (dir: Direction) => {
      if (mutex.isLocked)
        return

      await mutex.acquire()
      try {
        const r = toValue(room)
        if (!r)
          return

        if (dir === Direction.Backward) {
          const canLoadMore = await retry(
            scrollBack,
            {
              delay: attempts => attempts * 50,
              retries: 6,
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
    onTimeline: (...params) => {
      if (!isScrolling.value) {
        sync()
        hooks?.onTimeline?.(...params)
      }
    },
    onTimelineRefresh: (...params) => {
      if (!isScrolling.value)
        sync()
      hooks?.onTimelineRefresh?.(...params)
    },
    onTimelineReset: (...params) => {
      if (!isScrolling.value)
        sync()
      hooks?.onTimelineReset?.(...params)
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

    if (prevLen === newLen) {
      if (!canLoadMore)
        return false

      throw new $Error('previous event length equals new event length')
    }

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
