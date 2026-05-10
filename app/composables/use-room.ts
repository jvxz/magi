import type { EffectScope, ShallowRef } from 'vue'
import { toRef } from '@vueuse/core'
import { Room, RoomEvent, RoomStateEvent } from 'matrix-js-sdk'

type Key = string

interface Entry {
  scope: EffectScope
  ref: ShallowRef<Room | undefined>
  subs: number
}

const cache = new Map<string, Entry>()

const createKey = (roomId: string) => roomId

function acquire(roomId: string) {
  const key = createKey(roomId)

  let entry = cache.get(key)
  if (!entry) {
    const scope = effectScope(true)

    const ref = scope.run(() => {
      const { client } = useMatrixClient()
      const { onRoom } = useMatrixHooks()

      const room = shallowRef<Room | undefined>(client.value.getRoom(key) ?? undefined)
      const refresh = debounce(() => {
        const r = isTestMode() ? createMockRoom(500, key) : client.value.getRoom(key)

        room.value = r ?? undefined
        triggerRef(room)
      }, 50)

      onRoom(refresh)

      watchEffect((onCleanup) => {
        const r = room.value
        if (!r)
          return

        const update = () => triggerRef(room)
        r.on(RoomEvent.MyMembership, update)
        r.on(RoomStateEvent.Events, update)

        onCleanup(() => {
          r.off(RoomEvent.MyMembership, update)
          r.off(RoomStateEvent.Events, update)
        })
      })

      return room
    })!

    entry = { ref, scope, subs: 0 }

    cache.set(key, entry)
  }
  entry.subs++
  return entry
}

function release(key: Key) {
  const entry = cache.get(key)
  if (!entry)
    return

  entry.subs--

  if (entry.subs <= 0) {
    entry.scope.stop()
    cache.delete(key)
  }
}

export function useRoom(roomInput: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const roomInputRef = toRef(roomInput)

  const room = shallowRef<Room | undefined>()

  watch(roomInputRef, () => {
    const resolved = roomInputRef.value

    if (!resolved) {
      room.value = undefined
      return
    }

    if (resolved instanceof Room) {
      room.value = resolved
      triggerRef(room)
      return
    }

    const entry = acquire(resolved)

    const { stop } = watch(entry.ref, (value) => {
      room.value = value
      triggerRef(room)
    }, { immediate: true })

    onWatcherCleanup(() => {
      stop()
      release(createKey(resolved))
    })
  }, { immediate: true })

  return room
}
