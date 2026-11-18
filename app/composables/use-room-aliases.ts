import type { Room } from 'matrix-js-sdk'

export function useRoomAliases(room: MaybeRefOrGetter<Room | undefined>) {
  const publishedAliases = useRoomComputed(room, getPublishedRoomAliases)

  const { data: localAliases } = useRoomLocalAliases(room)

  const mainAlias = computed(() => publishedAliases.value?.alias)
  const allAliases = computed(() => flattenRoomAliases(publishedAliases.value))

  return {
    allAliases,
    localAliases,
    mainAlias,
    publishedAliases,
  }
}
