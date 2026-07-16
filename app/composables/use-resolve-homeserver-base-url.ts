export const useResolveHomeserverBaseUrl = (homeserver: MaybeRefOrGetter<string | undefined>) => {
  const homeserverRef = toRef(homeserver)

  const { data: config } = useHomeserverConfig(homeserverRef)
  const baseUrl = computed(() => config.value?.['m.homeserver'].base_url ?? homeserverRef.value)

  return baseUrl
}
