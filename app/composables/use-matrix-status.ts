export function useMatrixStatus() {
  const config = useRuntimeConfig()

  return useState(
    'matrix:status',
    () => ref({
      isAuthed: config.public.testMode ?? false,
      isDataSynced: config.public.testMode ?? false,
    }),
  )
}
