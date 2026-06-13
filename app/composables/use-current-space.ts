export const useCurrentSpace = () => {
  const spaceId = useCurrentSpaceId()
  const space = useRoom(spaceId)

  return space
}
