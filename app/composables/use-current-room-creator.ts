export function useCurrentRoomCreator() {
  const currentRoom = useCurrentRoom()

  return computed(() => currentRoom.value?.getCreator())
}
