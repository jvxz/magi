import { createStorage } from 'unstorage'
import indexedDbDriver from 'unstorage/drivers/indexedb'

export const idb = createStorage({
  driver: indexedDbDriver({ base: appMeta.name }),
})
