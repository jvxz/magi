import type { MatrixClient } from 'matrix-js-sdk'
import { createClient } from 'matrix-js-sdk'
import { skipHydrate } from 'pinia'

export const useClientStore = defineStore('client', () => {
  const client = shallowRef<MatrixClient>(createClient({ baseUrl: 'https://matrix.org' }))

  function $reset() {
    client.value = createClient({ baseUrl: 'https://matrix.org' })
  }

  return {
    $reset,
    client: skipHydrate(client),
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useClientStore, import.meta.hot))
