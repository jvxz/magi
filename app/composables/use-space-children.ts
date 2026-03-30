import type { InfiniteData, QueryKey } from '@tanstack/vue-query'
import { useInfiniteQuery } from '@tanstack/vue-query'

export function useSpaceChildren(_spaceId: MaybeRefOrGetter<string | undefined>, canFetchMore?: MaybeRefOrGetter<boolean>) {
  const spaceId = computed(() => toValue(_spaceId))

  const { client } = useMatrixClient()
  const room = useRoom(spaceId)

  const query = useInfiniteQuery<RoomsWithBatchToken | undefined, Error, InfiniteData<RoomsWithBatchToken | undefined>, QueryKey, string | undefined>({
    enabled: () => !!room.value,
    getNextPageParam: lastPage => lastPage?.nextBatchToken ?? undefined,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      if (!room.value)
        return

      const x = await getSpaceRooms(client.value, room.value, pageParam as string | undefined)
      return x
    },
    queryKey: ['spaceChildren', spaceId],
  })

  watchEffect(async () => {
    if (query.hasNextPage.value && !query.isFetchingNextPage.value && toValue(canFetchMore))
      await query.fetchNextPage()
  })

  const rooms = computed(() =>
    query.data.value?.pages.flatMap(page => page?.rooms) ?? [],
  )

  return {
    ...query,
    rooms,
  }
}
