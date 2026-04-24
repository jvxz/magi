export function useMutualRooms(otherUserMaybeId: MaybeRefOrGetter<MaybeUserOrId | undefined | null>) {
  const { client } = useMatrixClient()
  const otherUser = useUser(otherUserMaybeId)

  const query = useQuery({
    enabled: () => !!otherUser.value,
    queryFn: () => getMutualRooms(client.value, otherUser.value?.userId),
    queryKey: ['mutualRooms', () => otherUser.value?.userId],
    retry: 1,
    retryOnMount: false,
  })

  return query
}
