import { toRef } from '@vueuse/core'
import { Room } from 'matrix-js-sdk'

export function useRoom(roomInput: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const inputRef = toRef(roomInput)
  const roomEffectScope = useRoomEffectScope(roomInput)
  const roomRef = shallowRef<Room>()

  watch(
    inputRef,
    input => {
      roomRef.value = input instanceof Room ? markRaw(input) : roomEffectScope.value?.ref.value
      triggerRef(roomRef)
    },
    { immediate: true },
  )

  return roomRef
}
