export const useSelf = createGlobalState(() => {
  const { client } = useMatrixClient()
  const { onSync, onUserProfile } = useMatrixHooks()

  const userId = computed(() => client.value.getUserId() ?? undefined)
  const self = useUser(userId)
  const profile = useUserProfile(userId)

  onUserProfile(self.trigger)
  onSync(self.trigger)

  return { profile, self }
})
