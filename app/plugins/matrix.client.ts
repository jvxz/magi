import { SyncState } from 'matrix-js-sdk'

export default defineNuxtPlugin({
  name: 'matrix',
  order: 0,
  parallel: true,
  setup: () => {
    const status = useMatrixStatus()
    const { onSync } = useMatrixHooks()
    const ready = ref(false)

    const init = async () => {
      try {
        if (isTestMode())
          return

        status.value.isStarting = true
        status.value.isDataSynced = false

        const { client, initAuthedClient } = useMatrixClient()

        const authPayload = await idb.get<AuthPayload>('auth')
        if (authPayload) {
          const authedClient = await initAuthedClient(false)
          if (!authedClient)
            logoutClient(client.value)

          else
            status.value.isAuthed = true
        }
      }
      finally {
        const router = useRouter()
        const route = useRoute()

        status.value.isStarting = false

        if (route.path.startsWith('/app') && !status.value.isAuthed)
          await router.replace('/login')

        else if (route.path.startsWith('/login') && status.value.isAuthed)
          await router.replace('/app')
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

    // process isDataSynced status when client changes
    onSync((syncState, _prevState) => {
      if (syncState === SyncState.Prepared) {
        status.value.isDataSynced = true
        ready.value = true
      }
    })

    void init()

    return {
      provide: {
        ready,
      },
    }
  },
})
