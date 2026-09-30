export const useCurrentDevice = createGlobalState(() => {
  const { client } = useMatrixClient()
  const { devices } = useDevices()

  return computed(() => {
    const id = client.value.deviceId
    if (id) return devices.value.get(id)
  })
})
