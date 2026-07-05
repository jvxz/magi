export const useSelf = createGlobalState(() => {
  const { client } = useMatrixClient()
  const { onUserProfile, onSync } = useMatrixHooks()

  const self = useUser(() => client.value.getUserId())
  onUserProfile(self.trigger)
  onSync(self.trigger)

  return { self }
})
