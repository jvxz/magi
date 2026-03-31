export const getLastSpaceRouteKey = (spaceId: MaybeRefOrGetter<string | undefined>) => `lastSpaceRoute:${toValue(spaceId)}`

export function useLastSpaceRoute(spaceId: MaybeRefOrGetter<string | undefined>) {
  const spaceIdRef = toRef(spaceId)

  const lastRoute = useLocalStorage(() => getLastSpaceRouteKey(spaceIdRef), () => '')

  const route = useRoute()
  watch(route, () => lastRoute.value = route.path)

  return {
    lastRoute,
  }
}
