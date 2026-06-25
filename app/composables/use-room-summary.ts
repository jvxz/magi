export const useRoomSummary = createProvidableComposable(
  'useRoomSummary',
  (roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) => {
    const roomId = useResolveRoomId(roomOrId)
    const { client } = useMatrixClient()

    return useQuery({
      queryFn: () => {
        if (!roomId.value) return null
        const { serverName } = parseRoomId(roomId.value) ?? {}
        return client.value.getRoomSummary(roomId.value, serverName ? [serverName] : [])
      },
      queryKey: ['roomSummary', roomId],
      refetchOnWindowFocus: true,
    })
  },
)
