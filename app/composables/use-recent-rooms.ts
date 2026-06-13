interface RecentRoomEntry {
  lastVisited: number
  isSpace: boolean
}

type RecentRoomsState = Map<string, RecentRoomEntry>

export const useRecentRooms = createGlobalState(() => {
  const { self } = useSelf()
  const recentRooms = useLocalStorage<RecentRoomsState>(`${self.value?.userId}:recentRooms`, new Map(), {
    shallow: true,
  })

  const sortedRecentRooms = computed(() =>
    orderBy(
      Array.from(recentRooms.value, ([key, v]) => ({ key, ...v })),
      ['lastVisited'],
      ['desc', 'desc'],
    ),
  )

  function bumpRecentRoom(room: MaybeRoomOrId, isSpace: boolean) {
    recentRooms.value.set(resolveRoomId(room), {
      isSpace,
      lastVisited: Date.now(),
    })

    triggerRef(recentRooms)
  }

  function removeRecentRoom(room: MaybeRoomOrId) {
    recentRooms.value.delete(resolveRoomId(room))
    triggerRef(recentRooms)
  }

  const currentRoom = useCurrentRoom()
  watch(currentRoom, r => {
    if (r) bumpRecentRoom(r, r.isSpaceRoom())
  })

  return {
    bumpRecentRoom,
    recentRooms,
    removeRecentRoom,
    sortedRecentRooms,
  }
})
