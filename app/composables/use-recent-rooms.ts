interface RecentRoomEntry {
  lastVisited: number
  isSpace?: boolean
  parentSpaceId: string
}

type RecentRoomsState = Map<string, RecentRoomEntry>
type RecentRoomsBlacklistedState = Set<string>

export const useRecentRooms = createGlobalState(() => {
  const recentRooms = useScopedLocalStorage<RecentRoomsState>('recentRooms', new Map(), {
    shallow: true,
  })
  const recentRoomsBlacklisted = useScopedLocalStorage<RecentRoomsBlacklistedState>(
    'recentRoomsBlacklisted',
    new Set(),
    {
      shallow: true,
    },
  )

  const sortedRecentRooms = computed(() =>
    orderBy(
      Array.from(recentRooms.value, ([key, v]) => ({ key, ...v })),
      ['lastVisited'],
      ['desc', 'desc'],
    ),
  )

  function bumpRecentRoom(room: MaybeRoomOrId, opts: { isSpace?: boolean; parentSpaceId: string }) {
    if (isRoomBlacklisted(room)) return

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

  function blacklistRoom(room: MaybeRoomOrId) {
    recentRoomsBlacklisted.value.add(resolveRoomId(room))
    triggerRef(recentRoomsBlacklisted)
    removeRecentRoom(room)
  }

  function unblacklistRoom(room: MaybeRoomOrId) {
    recentRoomsBlacklisted.value.delete(resolveRoomId(room))
    triggerRef(recentRoomsBlacklisted)
  }

  function isRoomBlacklisted(room: MaybeRoomOrId) {
    return recentRoomsBlacklisted.value.has(resolveRoomId(room))
  }

  return {
    blacklistRoom,
    bumpRecentRoom,
    isRoomBlacklisted,
    recentRooms,
    removeRecentRoom,
    sortedRecentRooms,
    unblacklistRoom,
  }
})
