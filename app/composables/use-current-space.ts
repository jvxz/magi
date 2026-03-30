export function useCurrentSpace() {
  const route = useRoute()

  return useRoom(() => ('spaceId' in route.params) ? route.params.spaceId : '')
}
