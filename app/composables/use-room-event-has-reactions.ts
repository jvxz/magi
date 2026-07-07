import type { MatrixEvent, Room } from 'matrix-js-sdk'

import { toRef } from '@vueuse/core'

export function useRoomEventHasReactions(room: MaybeRefOrGetter<Room>, event: MaybeRefOrGetter<MatrixEvent>) {
  const roomRef = toRef(room)
  const eventRef = toRef(event)
  const hasReactions = ref(refresh())

  function refresh() {
    return !!getEventReactions(roomRef.value, eventRef.value)?.size
  }

  useRoomHooks(room, {
    onTimeline: () => (hasReactions.value = refresh()),
  })

  return hasReactions
}
