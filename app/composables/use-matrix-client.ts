import type { MatrixClient } from 'matrix-js-sdk'
import { createClient } from 'matrix-js-sdk'

export const useMatrixClient = createGlobalState(() => {
  const client = shallowRef<MatrixClient>(createClient({ baseUrl: MATRIX_BASE_URL }))

  function reset() {
    client.value = createClient({ baseUrl: MATRIX_BASE_URL })
  }

  return {
    client,
    reset,
  }
})
