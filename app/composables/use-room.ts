import { toRef } from '@vueuse/core'
import { Room } from 'matrix-js-sdk'

export function useRoom(maybeRoomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>, allowUnjoined: MaybeRefOrGetter<boolean> = false) {
  const maybeRoomOrIdRef = toRef(maybeRoomOrId)
  const allowUnjoinedRef = toRef(allowUnjoined)
  const { client } = useMatrixClient()
  const joinedRooms = useJoinedRooms()
  const { onRoom } = useMatrixHooks()

  const room = shallowRef<Room | undefined>(undefined)
  const get = () => {
    const r = maybeRoomOrIdRef.value instanceof Room
      ? maybeRoomOrIdRef.value
      : isTestMode()
        ? createMockRoom(500, maybeRoomOrIdRef.value!)
        : isDefined(maybeRoomOrIdRef.value)
          ? getRoom(client.value, maybeRoomOrIdRef.value, allowUnjoinedRef.value
              ? undefined
              : new Set(joinedRooms.value))
          : undefined

    void r?.loadMembersIfNeeded()
    if (r)
      room.value = r

    else room.value = undefined

    triggerRef(room)
  }

  watch([maybeRoomOrIdRef, allowUnjoinedRef], get, { immediate: true })

  onRoom(get)

  return room
}
