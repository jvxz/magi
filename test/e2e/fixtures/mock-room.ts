import type { MatrixEvent, Room } from 'matrix-js-sdk'

export function createMockRoom(eventCount: number = 250): Room {
  const roomId = '!test:localHost'
  const events = createMockEvents(eventCount, roomId)

  return {
    getLiveTimeline: () => ({
      getEvents: () => events,
      getPaginationToken: () => 'token',
    }),
    roomId,
  } as unknown as Room
}

function createMockEvents(eventCount: number, roomId: string): MatrixEvent[] {
  return Array.from({ length: eventCount }, (_, i) => {
    const id = i === 0
      ? 'oldest-event'
      : i === eventCount - 1
        ? 'newest-event'
        : crypto.randomUUID()
    const content = {
      body: `Event ${id} (${i})`,
      msgtype: 'm.text',
    }

    const event: Partial<Record<keyof MatrixEvent, unknown>> & { _size: number } = {
      _size: Math.max(64, Math.random() * 250),
      event: {
        content,
        type: 'm.room.message',
      },
      getContent: () => content,
      getId: () => id,
      getRoomId: () => roomId,
      getSender: () => '@test:localhost',
      getTs: () => Math.random(),
      getType: () => 'm.room.message',
      isEncrypted: () => false,
    }

    return event as unknown as MatrixEvent
  })
}
