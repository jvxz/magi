import type { MatrixEvent, Room } from 'matrix-js-sdk'

export const useRoomReplyEvent = createProvidableComposable('useRoomReplyEvent', (event: MatrixEvent, room: Room) => {
  const isReplyEvent = checkReplyEvent(event)

  if (!isReplyEvent || !event.replyEventId) {
    return {
      data: shallowRef<MatrixEvent | undefined>(undefined),
      isLoading: shallowRef(false),
      isReplyEvent,
    }
  }

  const { client } = useMatrixClient()

  const query = useQuery<MatrixEvent | undefined>({
    queryFn: async () => {
      const replyEventId = event.replyEventId
      if (!replyEventId) return undefined

      const replyEvent = await getRoomEventById(room, client.value, replyEventId)
      await replyEvent.getDecryptionPromise()

      return replyEvent
    },
    queryKey: ['roomReplyEvent', () => event.replyEventId, () => room.roomId],
    shallow: true,
  })

  return { ...query, isReplyEvent }
})
