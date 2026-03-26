import { ClientEvent } from 'matrix-js-sdk'

export default defineNuxtPlugin({
  order: 0,
  setup: async () => {
    // init client
    const { loginPersisted } = useAuth()
    const { client } = useMatrixClient()
    const { refreshMe } = useUser()

    const persistedClient = await loginPersisted()

    if (persistedClient) {
      client.value = persistedClient

      await client.value.startClient()
      await refreshMe()

      const sw = await getServiceWorker()
      if (sw) {
        await messageSw('session', {
          accessToken: client.value.getAccessToken(),
          baseUrl: client.value.getHomeserverUrl(),
        })
      }
    }

    // status watchers
    const status = useState(
      'matrix:status',
      () => ({
        isDataSynced: false,
      }),
    )

    const toggleDataSynced = () => status.value.isDataSynced = true
    client.value.on(ClientEvent.Sync, toggleDataSynced)
    whenever(() => status.value.isDataSynced, () => client.value.off(ClientEvent.Sync, toggleDataSynced))

    return {
      provide: {
        matrix: {
          status,
        },
      },
    }
  },
})
