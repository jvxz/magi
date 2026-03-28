export function useMatrixStatus() {
  return useState(
    'matrix:status',
    () => ref({
      isAuthed: false,
      isDataSynced: false,
    }),
  )
}
