export const useCurrentRoom = createGlobalState(() => {
  const route = useRoute()
  const roomId = computed(() =>
    'roomId' in route.params
      ? route.params.roomId
      : 'directRoomId' in route.params
        ? route.params.directRoomId
        : undefined,
  )

  const room = useRoom(roomId)

  return room
})
