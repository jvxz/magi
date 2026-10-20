export type RecentRoomEntry = ContextMenuRegions['homeRoom']['room'] & {
  lastVisited: number
}

type RecentRoomsState = Map<string, RecentRoomEntry>
type RecentRoomsBlacklistedState = Set<string>

const MAX_RECENT_ROOMS = 50

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

    recentRooms.value.delete(payload.roomId)
    recentRooms.value.set(payload.roomId, {
      ...payload,
      lastVisited: Date.now(),
    })

    if (recentRooms.value.size > MAX_RECENT_ROOMS) {
      const ordered = orderBy([...recentRooms.value], [([, v]) => v.lastVisited], ['desc']).slice(MAX_RECENT_ROOMS)
      for (const [key] of ordered) recentRooms.value.delete(key)
    }

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
