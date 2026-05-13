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

const DIGIT_RE = /^\d+$/

function acquire(roomId: string) {
  const key = createKey(roomId)

  let entry = cache.get(key)
  if (!entry) {
    const scope = effectScope(true)

    const ref = scope.run(() => {
      const { client } = useMatrixClient()
      const { onRoom } = useMatrixHooks()

      const getRoom = () => {
        if (!isTestMode()) return client.value.getRoom(key)

        const mockEventCount = DIGIT_RE.test(key) ? Number(key) : 500
        return createMockRoom(mockEventCount, key)
      }
      const rawRoom = getRoom()
      // markRaw is needed because the room mutates itself under the hood, breaking vue's proxy system
      const room = shallowRef<Room | undefined>(rawRoom ? markRaw(rawRoom) : undefined)
      const refresh = debounce(() => {
        const r = getRoom()

        room.value = r ? markRaw(r) : undefined
        triggerRef(room)
      }, 50)

      onRoom(refresh)

      const update = debounce(() => triggerRef(room), 50)
      watchEffect(onCleanup => {
        const r = room.value
        if (!r) return

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
  if (!entry) return

  entry.subs--

  if (entry.subs <= 0) {
    entry.scope.stop()
    cache.delete(key)
  }
}

export function useRoom(roomInput: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const roomInputRef = toRef(roomInput)

  const room = shallowRef<Room | undefined>()

  watch(
    roomInputRef,
    () => {
      const resolved = roomInputRef.value

      if (!resolved) {
        room.value = undefined
        return
      }

      if (resolved instanceof Room) {
        room.value = markRaw(resolved)
        triggerRef(room)
        return
      }

      const entry = acquire(resolved)

      const { stop } = watch(
        entry.ref,
        value => {
          room.value = value
          triggerRef(room)
        },
        { immediate: true },
      )

      onWatcherCleanup(() => {
        stop()
        release(createKey(resolved))
      })
    },
    { immediate: true },
  )

  return room
}
