import type { AsyncDataOptions } from '#app'
import { createClient } from 'matrix-js-sdk'

export const useMatrix = createUnrefFn((_baseUrl?: string) => {
  const baseUrl = withHttps(_baseUrl ?? MATRIX_BASE_URL)
  const client = baseUrl ? createClient({ baseUrl }) : useNuxtApp().$matrix

  const getPublicRooms = (opts?: AsyncDataOptions<Awaited<ReturnType<typeof client.publicRooms>>>) => useAsyncData('publicRooms', async () => client.publicRooms(), {
    ...opts,
    server: false,
  })

  return {
    client,
    getPublicRooms,
  }
})
