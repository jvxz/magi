import { SyncState } from 'matrix-js-sdk'

export default defineNuxtPlugin({
  name: 'matrix',
  order: 0,
  parallel: true,
  setup: () => {
    const status = useMatrixStatus()
    const ready = ref(false)

    const init = async () => {
      try {
        if (isTestMode())
          return

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
          if (syncState === SyncState.Prepared) {
            status.value.isDataSynced = true
            ready.value = true
          }
        })
      }
      finally {
        status.value.isStarting = false
      }
    }

    addRouteMiddleware('auth', async (to) => {
      if (import.meta.server || status.value.isStarting)
        return

      if (!status.value.isAuthed && to.path.includes('/app'))
        return navigateTo('/login')

      if (status.value.isAuthed && to.path.includes('/login'))
        return navigateTo('/app')
    })

    void init()

    return {
      provide: {
        ready,
      },
    }
  },
})
