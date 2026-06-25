export const useCurrentRoomId = createGlobalState(() => {
  const route = useRoute()
  return computed(() =>
    'roomId' in route.params
      ? route.params.roomId
      : 'directRoomId' in route.params
        ? route.params.directRoomId
        : undefined,
  )
})

export const useCurrentRoom = createGlobalState(() => {
  const roomId = useCurrentRoomId()
  return useRoom(roomId)
})
