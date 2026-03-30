export function usePublicRooms(_server: MaybeRefOrGetter<string>) {
  const { client } = useMatrixClient()
  const server = computed(() => withoutTrailingSlash(withoutProtocol(toValue(_server))))

  const query = useQuery({
    queryFn: async () => client.value.publicRooms({ server: server.value }),
    queryKey: ['publicRooms', server],
  })

  return query
}
