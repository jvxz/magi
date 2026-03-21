import type { AsyncDataOptions } from '#app'
import type { MatrixClient } from 'matrix-js-sdk'

export function usePublicRooms(_server: MaybeRefOrGetter<string>) {
  const nuxtApp = useNuxtApp()
  const clientStore = useClientStore()
  const server = computed(() => withoutTrailingSlash(withoutProtocol(toValue(_server))))

  const getPublicRooms = (opts?: AsyncDataOptions<Awaited<ReturnType<MatrixClient['publicRooms']>>>) => useAsyncData(
    () => `publicRooms:${server.value}`,
    async () => clientStore.client.publicRooms({ server: server.value }),
    {
      ...opts,
      getCachedData: key => nuxtApp.payload.data?.[key] || nuxtApp.static?.data?.[key] || undefined,
      server: false,
      watch: [server],
    },
  )

  return {
    getPublicRooms,
  }
}
