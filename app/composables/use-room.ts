import { toRef } from '@vueuse/core'
import { Room } from 'matrix-js-sdk'

export function useRoom(maybeRoomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const maybeRoomOrIdRef = toRef(maybeRoomOrId)
  const { client } = useMatrixClient()
  const { onSync } = useMatrixHooks()

  const room = shallowRef<Room | undefined>(undefined)
  const get = () => {
    const r = maybeRoomOrIdRef.value instanceof Room
      ? maybeRoomOrIdRef.value
      : isTestMode()
        ? createMockRoom(500, maybeRoomOrIdRef.value!)
        : client.value.getRoom(maybeRoomOrIdRef.value)

    void r?.loadMembersIfNeeded()
    if (r)
      room.value = r

    else room.value = undefined

    triggerRef(room)
  }

  watch(maybeRoomOrIdRef, get, { immediate: true })

  onSync(get)

  return room
}
