import type { MatrixClient } from 'matrix-js-sdk'
import type { IHierarchyRoom } from 'matrix-js-sdk/lib/@types/spaces'
import { useQueries } from '@tanstack/vue-query'
import { toRef } from '@vueuse/core'
import { EventType, RoomType } from 'matrix-js-sdk'

const LIMIT = 100
const MAX_PAGES = 20

type IRoomHierarchyLocal = IRoomHierarchy & { _localCount?: number }
type IHierarchyRoomWithCount = IHierarchyRoom & { roomCount?: number }

async function fetchHierarchyDeep(client: MatrixClient, spaceId: string, signal: AbortSignal) {
  const allRooms: IHierarchyRoom[] = []
  let nextBatch: string | undefined
  let pages = 0

  do {
    if (signal.aborted) throw new Error('Aborted')

    const res = await client.getRoomHierarchy(spaceId, LIMIT, 1, false, nextBatch)
    allRooms.push(...res.rooms)

    nextBatch = res.next_batch
    if (++pages >= MAX_PAGES) break
  } while (nextBatch)

  return { rooms: allRooms }
}

const isOrphanedRoom = (type: string | undefined) =>
  type !== RoomType.Space && type !== RoomType.ElementVideo && type !== RoomType.UnstableCall

export function useSpaceHierarchy(
  spaceId: MaybeRefOrGetter<string | undefined>,
  enabled: MaybeRefOrGetter<boolean> = true,
) {
  const { client } = useMatrixClient()
  const joinedRooms = useJoinedRooms()
  const spaceIdRef = refDefault(toRef(spaceId), '')
  const enabledRef = toRef(enabled)
  const queryKey = computed(() => ['spaceSubspaces', spaceIdRef.value] as const)

  const q = useQuery({
    enabled: enabledRef,
    queryFn: ({ signal }) => fetchHierarchyDeep(client.value, spaceIdRef.value, signal),
    queryKey,
  })

  const rooms = computed(() => {
    const map = new Map<string, IHierarchyRoom>()
    if (!q.data.value) return map

    const { rooms } = q.data.value

    for (const room of rooms) map.set(room.room_id, room)

    return map
  })

  const suggestedRooms = computed(
    () =>
      new Set(
        rooms.value
          .get(spaceIdRef.value)
          ?.children_state.filter(r => r.content.suggested)
          .map(r => r.state_key) ?? [],
      ),
  )

  const orphanedRooms = computed(() => {
    const map = new Map<string, IHierarchyRoom>()
    if (!rooms.value) return map

    for (const room of rooms.value.values()) {
      if (!isOrphanedRoom(room.room_type)) continue

      map.set(room.room_id, room)
    }

    return map
  })
  const subspaceList = computed(() =>
    [...rooms.value.values()].filter(r => r.room_id !== spaceIdRef.value && r.room_type === RoomType.Space),
  )

  const subspacesQueries = useQueries({
    queries: computed(() =>
      subspaceList.value.map(space => {
        const localRoom = getRoom(client.value, space.room_id)
        let localCount: number | undefined

        if (localRoom) {
          let count = 0
          let allKnown = true
          for (const e of getStateEvents(localRoom, EventType.SpaceChild)) {
            const childId = e.getStateKey()
            if (!childId || !e.getContent().via?.length) continue

            const childRoom = getRoom(client.value, childId, joinedRooms.value)
            if (!childRoom) {
              allKnown = false
              break
            }

            if (!isOrphanedRoom(childRoom.getType())) count++
          }

          if (allKnown) localCount = count
        }

        return {
          enabled: localCount === undefined && enabledRef.value,
          initialData: isDefined(localCount)
            ? ({ _localCount: localCount, rooms: [] } as IRoomHierarchyLocal)
            : undefined,
          persister: lsPersister.persisterFn,
          queryFn: ({ signal }: { signal: AbortSignal }) => fetchHierarchyDeep(client.value, space.room_id, signal),
          queryKey: ['spaceSubspaces', space.room_id] as const,
          select: (data: unknown) => {
            const d = data as IRoomHierarchyLocal

            if (isDefined(d._localCount)) return d._localCount

            return d.rooms.filter(r => r.room_id !== space.room_id && isOrphanedRoom(r.room_type)).length
          },
        }
      }),
    ),
  })

  const subspaces = computed(() => {
    const map = new Map<string, IHierarchyRoomWithCount>()
    subspaceList.value.forEach((space, i) => {
      map.set(space.room_id, {
        ...space,
        roomCount: subspacesQueries.value?.[i]?.data ?? 0,
      })
    })

    return map
  })

  return {
    ...q,
    orphanedRooms,
    rooms,
    subspaces,
    suggestedRooms,
  }
}
