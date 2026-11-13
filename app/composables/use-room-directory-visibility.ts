import { Visibility } from 'matrix-js-sdk'

export function useRoomDirectoryVisibility(roomOrId: MaybeRefOrGetter<MaybeRoomOrId>) {
  const { client } = useMatrixClient()
  const roomId = useResolveRoomId(roomOrId)

  const { data: queryData, ...query } = useQuery({
    queryFn: async () => {
      if (!roomId.value) return Visibility.Private
      return (await client.value.getRoomDirectoryVisibility(roomId.value)).visibility ?? Visibility.Private
    },
    queryKey: $qk.roomDirectoryVisibility(roomId),
  })

  const data = refDefault(queryData, Visibility.Private)

  return { ...query, data }
}
