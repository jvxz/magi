import { SyncState } from 'matrix-js-sdk'

export function useMatrixStatus() {
  const state = useState(
    'matrix:status',
    () => ref({
      clientState: null as SyncState | null,
      startupState: 'loading' as 'loading' | 'ready',
      isAuthed: isTestMode() ?? false,
      isDataSynced: isTestMode() ?? false,
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
