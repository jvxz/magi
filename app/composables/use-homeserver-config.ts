export const useHomeserverConfig = (homeserver: MaybeRefOrGetter<string | undefined>) => {
  const homeserverRef = toRef(homeserver)

  const q = useQuery({
    queryFn: () => (homeserverRef.value ? (getHomeserverConfig(homeserverRef.value) ?? null) : null),
    queryKey: $qk.homeserverConfig(homeserverRef),
  })

  return q
}
