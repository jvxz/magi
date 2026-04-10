import { SyncState } from 'matrix-js-sdk'

export default defineNuxtPlugin({
  order: 0,
  setup: async () => {
    const config = useRuntimeConfig()
    if (config.public.testMode)
      return

    const status = useMatrixStatus()
    const { onSync } = useMatrixHooks()

    // init client
    const { client, initAuthedClient } = useMatrixClient()

    const authPayload = await idb.get<AuthPayload>('auth')
    if (authPayload) {
      const authedClient = await initAuthedClient(false)
      if (!authedClient) {
        console.error('Unable to get authed client. Logging out...')
        logoutClient(client.value)
      }

      else
        status.value.isAuthed = true
    }

    // process isDataSynced status when client changes
    onSync((syncState, _prevState) => {
      if (syncState === SyncState.Prepared)
        status.value.isDataSynced = true
    })
  },
})
