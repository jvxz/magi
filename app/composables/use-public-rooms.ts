import type { MatrixClient } from 'matrix-js-sdk'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { toRef } from '@vueuse/core'

export type IPublicRoomsResponse = Awaited<ReturnType<MatrixClient['publicRooms']>>

export const PUBLIC_ROOM_PAGINATION_LIMIT = 36

export function usePublicRooms(server: MaybeRefOrGetter<string>, page?: MaybeRefOrGetter<number>, query?: MaybeRefOrGetter<string | undefined>) {
  const { client } = useMatrixClient()
  const serverResolved = computed(() => withoutTrailingSlash(withoutProtocol(toValue(server))))
  const pageRef = toRef(page)
  const queryRef = throttledRef(toRef(query), 500)

  const { data, fetchNextPage, fetchPreviousPage, hasNextPage, isFetching, ...q } = useInfiniteQuery({
    getNextPageParam: (lastPage: IPublicRoomsResponse) => lastPage.next_batch,
    getPreviousPageParam: (firstPage: IPublicRoomsResponse) => firstPage.prev_batch,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => client.value.publicRooms({
      filter: queryRef.value ? { generic_search_term: queryRef.value } : undefined,
      limit: PUBLIC_ROOM_PAGINATION_LIMIT,
      server: serverResolved.value,
      since: pageParam,
    }),
    queryKey: ['publicRooms', serverResolved, queryRef],
  })

  watch([pageRef, data], async ([newPage, newData]) => {
    if (!newPage || !newData || isFetching.value)
      return
    const currentTarget = newPage
    const fetchedPages = newData.pages.length

    if (currentTarget > fetchedPages && hasNextPage.value) {
      for (let i = fetchedPages; i < currentTarget && hasNextPage.value; i++) {
        // abort if user changed target page while fetching
        if (pageRef.value !== currentTarget)
          break

        await fetchNextPage()
      }
    }
  })

  const pages = computed(() => data.value?.pages ?? [])

  const currentPage = computed(() => data.value?.pages[(pageRef.value ?? 0) - 1])

  const canPaginateForward = computed(() => !!currentPage.value?.next_batch)
  const canPaginateBackward = computed(() => !!currentPage.value?.prev_batch)

  return {
    ...q,
    canPaginateBackward,
    canPaginateForward,
    currentPage,
    data,
    fetchNextPage,
    fetchPreviousPage,
    isFetching,
    pages,
  }
}

export function usePublicRoomsState(baseUrl: string) {
  const page = useState(`publicRoomPage:${baseUrl}`, () => 1)
  const query = useState<string | undefined>(`publicRoomQuery:${baseUrl}`)

  watch(query, () => {
    if (page.value !== 1)
      page.value = 1
  })

  return {
    page,
    query,
  }
}
