import type { MatrixEvent, Room } from 'matrix-js-sdk'


export function useRoomEvents(room: MaybeRefOrGetter<Room | undefined>) {
  const roomRef = toRef(room)
  const { client } = useMatrixClient()
  
  const events = shallowRef<MatrixEvent[]>([])
  
  const sync = () => {
    const liveEvents = roomRef.value?.getLiveTimeline().getEvents()
    
    events.value = [...(liveEvents ?? [])]
  }
  
  whenever(roomRef, sync, { immediate: true, once: true })
  
  useRoomEventHooks(() => roomRef.value?.roomId, {
    onTimeline: () => sync(),
    onTimelineRefresh: () => sync(),
    onTimelineReset: () => sync(),
  })
  
  const mutex = new Mutex()
  const { isPending: isScrolling, mutate: scrollBack, mutateAsync: scrollBackAsync, status: scrollBackStatus } = useMutation({
    mutationFn: async () => {
      if (mutex.isLocked)
        return

      await mutex.acquire()
      try {
        const r = toValue(room)
        if (!r)
          return

        await client.value.scrollback(r, 80)
        sync()
      }
      finally {
        mutex.release()
      }
    },
    mutationKey: ['scrollback', () => roomRef.value?.roomId],
  })

  // sync on decrypted events (usually messages)
  // const { onDecrypted } = useMatrixHooks()
  // onDecrypted(debounce(sync, 30))

  return {
    events,
    scrollBackStatus,
    scrollBack,
    isScrolling,
    scrollBackAsync,
  }
}
