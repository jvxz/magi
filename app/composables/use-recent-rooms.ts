type RecentRoomEntry = ContextMenuRegions['homeRoom']['room'] & {
  lastVisited: number
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
      ['desc'],
    ),
  )

  function bumpRecentRoom(payload: ContextMenuRegions['homeRoom']['room']) {
    if (isRoomBlacklisted(payload.roomId)) return

    recentRooms.value.set(payload.roomId, {
      ...payload,
      lastVisited: Date.now(),
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
