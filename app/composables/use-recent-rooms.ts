interface RecentRoomEntry {
  lastVisited: number
  isSpace?: boolean
  parentSpaceId?: string
}

type RecentRoomsState = Map<string, RecentRoomEntry>

export const useRecentRooms = createGlobalState(() => {
  const { self } = useSelf()
  const recentRooms = useLocalStorage<RecentRoomsState>(() => `${self.value?.userId}:recentRooms`, new Map(), {
    shallow: true,
  })

  const sortedRecentRooms = computed(() =>
    orderBy(
      Array.from(recentRooms.value, ([key, v]) => ({ key, ...v })),
      ['lastVisited'],
      ['desc', 'desc'],
    ),
  )

  function bumpRecentRoom(room: MaybeRoomOrId, opts?: { isSpace?: boolean; parentSpaceId?: string }) {
    recentRooms.value.set(resolveRoomId(room), {
      lastVisited: Date.now(),
      ...opts,
    })

    triggerRef(recentRooms)
  }

  function removeRecentRoom(room: MaybeRoomOrId) {
    recentRooms.value.delete(resolveRoomId(room))
    triggerRef(recentRooms)
  }

  return {
    bumpRecentRoom,
    recentRooms,
    removeRecentRoom,
    sortedRecentRooms,
  }
})
