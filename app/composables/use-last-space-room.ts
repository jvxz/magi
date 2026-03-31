export const getLastSpaceRoomKey = (spaceId: MaybeRefOrGetter<string | undefined>) => `lastRoom:${toValue(spaceId)}`

export function useLastSpaceRoom(spaceId: MaybeRefOrGetter<string | undefined>) {
  const spaceIdRef = toRef(spaceId)

  const lastRoom = useLocalStorage(() => getLastSpaceRoomKey(spaceIdRef), () => '')

  const getLastRoom = () => {
    const roomId = lastRoom.value
    return useRoom(roomId)
  }

  function setLastRoom(roomId: string) {
    lastRoom.value = roomId
  }

  return {
    getLastRoom,
    setLastRoom,
  }
}
