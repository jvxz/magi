export default defineNuxtPlugin({
  dependsOn: ['matrix'],
  setup: async () => {
    const visibility = useDocumentVisibility()
    const sw = await getServiceWorker()
    assert(sw, 'service worker was undefined when initializing heartbeat')

    sw.addEventListener('controllerchange', refreshAuth)
    whenever(() => visibility.value === 'visible', refreshAuth)

    async function refreshAuth() {
      const auth = await idb.getItem<AuthPayload>('auth')
      await messageSw('session', auth ?? {})
    }
  },
})
