import { createClient } from 'matrix-js-sdk'

export function createTempClient(baseUrl: string) {
  return createClient({ baseUrl })
}
