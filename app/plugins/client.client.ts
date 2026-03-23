export default defineNuxtPlugin({
  parallel: true,
  setup: async () => {
    const { loginPersisted } = useAuth()
    const clientStore = useClientStore()

    const persistedClient = await loginPersisted()

    if (persistedClient) {
      clientStore.client = persistedClient
      const sw = await getServiceWorker()
      if (sw)
        await sendSessionToSw(clientStore.client.getHomeserverUrl(), clientStore.client.getAccessToken() ?? undefined)
    }
  },
})
