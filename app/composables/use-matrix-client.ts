import type { MatrixClient } from 'matrix-js-sdk'
import { ClientEvent, createClient, SyncState } from 'matrix-js-sdk'

export const useMatrixClient = createGlobalState(() => {
  const client = shallowRef<MatrixClient>(createClient({ baseUrl: MATRIX_BASE_URL }))

  async function initAuthedClient(waitForPrepared = true) {
    const auth = await idb.getItem<AuthPayload>('auth')
    if (!auth)
      return

    try {
      const authedClient = await createAuthedClient(auth)

      void startClient(authedClient)
      if (waitForPrepared) {
        await new Promise<void>((resolve, reject) => {
          const onSync = (syncState: SyncState, _prevState: SyncState | null) => {
            if (syncState === SyncState.Prepared) {
              authedClient.off(ClientEvent.Sync, onSync)
              resolve()
            }

            if (syncState === SyncState.Error)
              reject(new Error('sync state was ERROR'))
          }
          authedClient.on(ClientEvent.Sync, onSync)
        })
      }

      client.value = authedClient
      await messageSw('session', auth)

      return authedClient
    }
    catch (err) {
      console.error('Error when initializing authed client: ', err)
    }
  }

  return {
    client,
    initAuthedClient,
  }
})
