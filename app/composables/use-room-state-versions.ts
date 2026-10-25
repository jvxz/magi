export const useRoomStateVersions = createSharedComposable(() => {
  const versions = shallowReactive(new Map<string, number>())
  const { onRoom, onRoomStateUpdate } = useMatrixHooks()

  const bump = (id: string) => versions.set(id, (versions.get(id) ?? 0) + 1)

  onRoomStateUpdate(state => bump(state.roomId))
  onRoom(room => bump(resolveRoomId(room)))

  return versions
})
