export const useMediaConfig = createGlobalState(() => {
  const { client } = useMatrixClient()
  const mediaConfig = shallowRef<IMediaConfig & { 'm.upload.size': number }>({ 'm.upload.size': Infinity })

  const refresh = async () => {
    const cfg = await client.value.getMediaConfig(true)
    mediaConfig.value = { ...cfg, 'm.upload.size': cfg['m.upload.size'] ?? Infinity }
  }
  refresh()

  return { mediaConfig, refresh }
})
