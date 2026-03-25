export default defineNuxtPlugin({
  order: 0,
  setup: async () => {
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
          accessToken: client.value.getHomeserverUrl(),
          baseUrl: client.value.getAccessToken(),
        })
      }
    }
  },
})
