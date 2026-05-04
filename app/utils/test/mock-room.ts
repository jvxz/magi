import type { MatrixEvent, Room } from 'matrix-js-sdk'

const mockRoomMap = new Map<string, Room>()

export function createMockRoom(eventCount: number = 250, id: string): Room {
  const cached = mockRoomMap.get(id)
  if (cached)
    return cached

  const events = createMockEvents(eventCount, id)

  const room = {
    getJoinedMembers: () => [],
    getLiveTimeline: () => ({
      getEvents: () => events,
      getPaginationToken: () => 'token',
    }),
    id,
    loadMembersIfNeeded: async () => {},
    membersLoaded: () => true,
    name: `Mock room: ${id}`,
    off: () => {},
    on: () => {},
    roomId: id,
  } as unknown as Room

  mockRoomMap.set(id, room)

  return room
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
      getClearContent: () => content,
      getContent: () => content,
      getId: () => id,
      getRoomId: () => roomId,
      getSender: () => '@test:localhost',
      getTs: () => Math.random(),
      getType: () => 'm.room.message',
      isBeingDecrypted: () => false,
      isDecryptionFailure: () => false,
      isEncrypted: () => false,
    }

    return event as unknown as MatrixEvent
  })
}
