export const useCurrentSpaceId = createSharedComposable(() => {
  const route = useRoute()
  return computed(() => ('spaceId' in route.params ? route.params.spaceId : ''))
})
