export const useCurrentRoom = createGlobalState(() => {
  const route = useRoute()
  const roomId = computed(() => ('roomId' in route.params) ? route.params.roomId : undefined)

  const room = useRoom(roomId)

  return room
})
