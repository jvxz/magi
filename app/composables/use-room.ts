import { toRef } from '@vueuse/core'
import { Room } from 'matrix-js-sdk'

export function useRoom(roomInput: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const inputRef = toRef(roomInput)
  const roomEffectScope = useRoomEffectScope(roomInput)
  const roomRef = shallowRef<Room>()

  watchEffect(() => {
    const input = inputRef.value
    const scoped = roomEffectScope.value?.ref.value
    roomRef.value = scoped ?? (input instanceof Room ? markRaw(input) : undefined)
    triggerRef(roomRef)
  })

  return roomRef
}
