import type { MatrixEvent, Room } from 'matrix-js-sdk'

import { EventStatus, EventType, RelationType, RoomEvent } from 'matrix-js-sdk'

export function useRoomActions(roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const room = useRoom(roomOrId)
  const { client } = useMatrixClient()

  const react = useMutation({
    mutationFn: async (params: {
      event: MatrixEvent
      reaction?: string
      redact:
        | false
        | {
            reactionEvent: MatrixEvent
          }
    }) => {
      if (!room.value) return

      const { event, reaction, redact } = params

      const event_id = event.getId()
      if (!event_id) return

      if (redact) {
        const { reactionEvent } = redact
        let reactionEventId = reactionEvent.getId()

        if (reactionEvent.status === EventStatus.QUEUED || reactionEvent.status === EventStatus.NOT_SENT) {
          client.value.cancelPendingEvent(reactionEvent)
          return
        }

        if (reactionEvent.status === EventStatus.SENDING) {
          const awaited = await waitForEvent(room.value, reactionEvent)
          assert(awaited, 'failed to get reaction event after waiting for pending event to resolve')
          reactionEventId = awaited.getId()
        }

        assert(reactionEventId, 'reactionEventId was undefined when trying to redact reaction')

        await client.value.redactEvent(room.value!.roomId, reactionEventId)

        return
      }

      if (!reaction) return

      const isReacting = isUserReacting(room.value, event, client.value.getSafeUserId(), reaction)
      if (isReacting) return

      await client.value.sendEvent(room.value.roomId, EventType.Reaction, {
        'm.relates_to': {
          event_id,
          key: reaction,
          rel_type: RelationType.Annotation,
        },
      })
    },
    mutationKey: ['react', () => room.value?.roomId],
  })

  return {
    react,
  }
}

function waitForEvent(room: Room, event: MatrixEvent) {
  if (!event.status) return Promise.resolve()

  return new Promise<MatrixEvent>((resolve, reject) => {
    const onUpdate = (updatedEvent: MatrixEvent) => {
      if (updatedEvent.getId() !== event.getId()) return

      if (updatedEvent.status === EventStatus.SENT || isNull(updatedEvent.status)) {
        room.off(RoomEvent.LocalEchoUpdated, onUpdate)
        resolve(updatedEvent)
      } else if (updatedEvent.status === EventStatus.NOT_SENT || updatedEvent.status === EventStatus.CANCELLED) {
        room.off(RoomEvent.LocalEchoUpdated, onUpdate)
        reject(new $Error('Event failed to send'))
      }
    }

    room.on(RoomEvent.LocalEchoUpdated, onUpdate)
  })
}
