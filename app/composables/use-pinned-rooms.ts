type PinnedRoomsState = Map<
  string,
  {
    spaceId: string
  }
>

export const usePinnedRooms = createGlobalState(() => {
  const pinnedRooms = useScopedLocalStorage<PinnedRoomsState>('pinnedRooms', new Map(), {
    shallow: true,
  })

  const pinnedRoomEntries = computed(() =>
    Array.from(pinnedRooms.value.entries(), e => ({
      key: e[0],
      ...e[1],
    })),
  )

  const pinRoom = (room: MaybeRoomOrId, space: MaybeRoomOrId) => {
    pinnedRooms.value.set(resolveRoomId(room), {
      spaceId: resolveRoomId(space),
    })
    triggerRef(pinnedRooms)
  }

  const unpinRoom = (room: MaybeRoomOrId) => {
    pinnedRooms.value.delete(resolveRoomId(room))
    triggerRef(pinnedRooms)
  }

  const isRoomPinned = (room: MaybeRoomOrId) => pinnedRooms.value.has(resolveRoomId(room))

  return {
    isRoomPinned,
    pinRoom,
    pinnedRoomEntries,
    pinnedRooms,
    unpinRoom,
  }
})
