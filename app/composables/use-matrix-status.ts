import { SyncState } from 'matrix-js-sdk'

export function useMatrixStatus() {
  const state = useState(
    'matrix:status',
    () => ref({
      clientState: null as SyncState | null,
      isAuthed: false,
      isDataSynced: false,
      isStarting: true,
    }),
  )

  const { onSync } = useMatrixHooks()
  onSync((e) => {
    if (e === SyncState.Syncing || e === SyncState.Prepared)
      return state.value.clientState = null

    state.value.clientState = e
  })

  return state
}
