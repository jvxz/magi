export default defineNuxtPlugin({
  order: 0,
  setup: async () => {
    const { loginPersisted } = useAuth()
    const { client } = useMatrixClient()
    // const { forceRefreshMe } = useUser()

    const persistedClient = await loginPersisted()

    if (persistedClient) {
      client.value = persistedClient
      await client.value.startClient()

      // await forceRefreshMe()

      const sw = await getServiceWorker()
      if (sw)
        await sendSessionToSw(client.value.getHomeserverUrl(), client.value.getAccessToken() ?? undefined)
    }
  },
})
