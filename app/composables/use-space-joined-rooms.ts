import { EventType } from 'matrix-js-sdk'

export function useSpaceJoinedRooms(spaceId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const { client } = useMatrixClient()
  const { revisions } = useRoomRevisions()

  return useRoomComputed(spaceId, space => {
    if (!space) return []

    // track space child revisions
    for (const event of getStateEvents(space, EventType.SpaceChild)) {
      const childId = event.getStateKey()
      if (childId) void revisions.get(childId)
    }

    return getJoinedRooms(client.value, space)
  })
}
