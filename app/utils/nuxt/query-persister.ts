import { experimental_createQueryPersister } from '@tanstack/query-persist-client-core'

export const lsPersister = experimental_createQueryPersister({
  maxAge: 1000 * 60 * 60 * 24,
  prefix: 'magi',
  storage: import.meta.client ? localStorage : null,
})
