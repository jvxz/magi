export function useCurrentRoomCreator() {
  const currentRoom = useCurrentRoom()

  return useRoomComputed(currentRoom, r => r?.getCreator())
}
