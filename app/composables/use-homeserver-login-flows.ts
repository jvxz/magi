export const useHomeserverLoginFlows = (homeserver: MaybeRefOrGetter<string | undefined>) => {
  const homeserverRef = toRef(homeserver)

  const q = useQuery({
    queryFn: () => (homeserverRef.value ? (getLoginFlows(homeserverRef.value) ?? null) : null),
    queryKey: $qk.homeserverLoginFlows(homeserverRef),
  })

  return q
}
