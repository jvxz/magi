import type { MatrixEvent, RoomMember, RoomState } from 'matrix-js-sdk'
import type { EffectScope, ShallowRef } from 'vue'
import { toRef } from '@vueuse/core'

type Value = RoomMember | undefined
type Key = `${string}:${string}`

interface Entry {
  scope: EffectScope
  ref: ShallowRef<Value>
  subs: number
}

const cache = new Map<string, Entry>()

function createKey(roomId: string, userId: string) {
  return `${roomId}:${userId}` as const
}

function acquire(roomId: string, userId: string) {
  const key = createKey(roomId, userId)

  let entry = cache.get(key)
  if (!entry) {
    const scope = effectScope(true)

    const ref = scope.run(() => {
      const room = useRoom(roomId)

      const member = shallowRef<Value>(room.value?.getMember(userId) ?? undefined)

      useRoomEventHooks(room, {
        onMembers: handleUpdate,
        onMemberUpdate: handleUpdate,
      })

      function handleUpdate(_event: MatrixEvent, _state: RoomState, newMember: RoomMember) {
        if (newMember.userId === userId) {
          member.value = newMember
          triggerRef(member)
        }
      }

      return member
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

export function useRoomMember(roomId: MaybeRefOrGetter<MaybeRoomOrId | undefined>, userId: MaybeRefOrGetter<MaybeUserOrId | undefined>) {
  const roomIdRef = toRef(roomId)
  const userIdRef = toRef(userId)

  const member = shallowRef<Value>()

  watch([roomIdRef, userIdRef], (_arr, _prev, onCleanup) => {
    const roomId = roomIdRef.value && resolveRoomId(roomIdRef.value)
    const userId = userIdRef.value && resolveUserId(userIdRef.value)

    if (!roomId || !userId) {
      member.value = undefined
      return
    }

    const entry = acquire(roomId, userId)

    const { stop } = watch(entry.ref, (value) => {
      member.value = value
      triggerRef(member)
    }, { immediate: true })

    onCleanup(() => {
      stop()
      release(createKey(roomId, userId))
    })
  }, { immediate: true })

  return member
}
