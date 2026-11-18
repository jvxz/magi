import { EventType } from 'matrix-js-sdk'

export function useRoomLocalAliases(roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const roomId = useResolveRoomId(roomOrId)
  const { client } = useMatrixClient()

  const { data, ...query } = useQuery({
    queryFn: () => getLocalRoomAliases(client.value, roomId.value),
    queryKey: $qk.roomLocalAliases(roomId),
  })

  const defaultedData = refDefault(data, [])

  const canonicalAliasEventId = useRoomComputed(roomOrId, r => getStateEvent(r, EventType.RoomCanonicalAlias)?.getId())
  watch(canonicalAliasEventId, () => query.refetch())

  return { data: defaultedData, ...query }
}
