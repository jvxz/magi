import type { InviteOpts, MatrixEvent, Room } from 'matrix-js-sdk'
import type { RoomMessageEventContent } from 'matrix-js-sdk/lib/types'

import { EventStatus, EventType, RelationType, RoomEvent } from 'matrix-js-sdk'

export function useRoomActions(roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const room = useRoom(roomOrId)
  const roomId = useResolveRoomId(roomOrId)
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
    mutationKey: $mk.react(roomId),
  })

  const message = useMutation({
    mutationFn: async (eventContent: RoomMessageEventContent) => {
      if (!room.value) return
      return await client.value.sendMessage(room.value.roomId, eventContent)
    },
    mutationKey: $mk.message(roomId),
  })

  const typing = useMutation({
    mutationFn: async (params: { isTyping: boolean }) => {
      if (!room.value) return false

      try {
        await client.value.sendTyping(room.value.roomId, params.isTyping, TYPING_TIMEOUT_MS)
        return true
      } catch {
        return false
      }
    },
  })

  const leave = useMutation({
    mutationFn: async () => {
      if (!room.value?.roomId) return

      const res = await client.value.leave(room.value.roomId)
      await client.value.forget(room.value.roomId)

      return res
    },
    mutationKey: $mk.leaveRoom(roomId),
  })

  const invite = useMutation({
    mutationFn: async ({ opts, userId }: { userId: string; opts?: InviteOpts }) => {
      if (!room.value?.roomId) return
      return client.value.invite(room.value.roomId, userId, opts)
    },
    mutationKey: $mk.invite(roomId),
  })

  return {
    invite,
    leave,
    message,
    react,
    typing,
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
