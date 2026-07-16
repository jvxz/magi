export const useHomeserverLoginFlows = (homeserver: MaybeRefOrGetter<string | undefined>) => {
  const homeserverRef = toRef(homeserver)

  const q = useQuery({
    queryFn: () => (homeserverRef.value ? (getLoginFlows(homeserverRef.value) ?? null) : null),
    queryKey: $qk.homeserverLoginFlows(homeserverRef),
    retry: (n, e) => {
      const parsed = parseError(e)
      if (parsed.code === ErrorCode.InvalidUrl || n > 2) return false
      return true
    },
  })

  return q
}
