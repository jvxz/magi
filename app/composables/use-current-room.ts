export const useCurrentRoom = createGlobalState(() => {
  const route = useRoute()
  const roomId = computed(() => ('roomId' in route.params) ? route.params.roomId : '')

  return useRoom(roomId)
})
