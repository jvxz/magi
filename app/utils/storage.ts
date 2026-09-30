import { createStorage } from 'unstorage'
import indexedDbDriver from 'unstorage/drivers/indexedb'

export const idb = createStorage({
  driver: indexedDbDriver({ base: GENERAL__APP_META.name }),
})

export const getLastSpaceRouteKey = (spaceId: MaybeRefOrGetter<string | undefined>) =>
  `lastSpaceRoute:${toValue(spaceId)}`
