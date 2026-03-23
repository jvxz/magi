export default defineNuxtPlugin({
  parallel: true,
  setup: async () => {
    const { loginPersisted } = useAuth()
    const { client } = useMatrixClient()

    const persistedClient = await loginPersisted()

    if (persistedClient) {
      client.value = persistedClient
      const sw = await getServiceWorker()
      if (sw)
        await sendSessionToSw(client.value.getHomeserverUrl(), client.value.getAccessToken() ?? undefined)
    }
  },
})
