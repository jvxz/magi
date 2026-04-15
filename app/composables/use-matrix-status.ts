export function useMatrixStatus() {
  return useState(
    'matrix:status',
    () => ref({
      isAuthed: isTestMode() ?? false,
      isDataSynced: isTestMode() ?? false,
    }),
  )
}
