import type { ICreateClientOpts } from 'matrix-js-sdk'
import { createClient } from 'matrix-js-sdk'

export function createTempClient(baseUrl: string, opts?: Omit<ICreateClientOpts, 'baseUrl'>) {
  return createClient({ baseUrl, ...opts })
}
