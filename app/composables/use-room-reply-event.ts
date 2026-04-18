import type { MatrixEvent, Room } from 'matrix-js-sdk'

export function useRoomReplyEvent(event: MatrixEvent, room: Room) {
  const { client } = useMatrixClient()

  const query = useQuery<MatrixEvent | undefined>({
    enabled: () => !!event.replyEventId,
    queryFn: async () => {
      const replyEventId = event.replyEventId
      if (!replyEventId)
        return undefined

      const replyEvent = await getRoomEventById(room, client.value, replyEventId)
      await replyEvent.getDecryptionPromise()

      return replyEvent
    },
    queryKey: ['roomReplyEvent', () => event.replyEventId, () => room.roomId],
    shallow: true,
  })

  const isReplyEvent = checkReplyEvent(event)

  return { ...query, isReplyEvent }
}
