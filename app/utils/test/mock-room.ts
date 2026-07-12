import { KnownMembership, MatrixEvent, Room, RoomMember } from 'matrix-js-sdk'

const DEFAULT_SENDER = '@test:localhost'
const DEFAULT_START_TS = Date.UTC(2026, 0, 1)

export interface MockRoom {
  room: Room
  pushMessage: (opts?: PushMessageOptions) => MatrixEvent
  pushReaction: (target: MatrixEvent, key: string, opts?: PushReactionOptions) => MatrixEvent
  redact: (event: MatrixEvent) => void
  setMemberTyping: (userId: string, typing: boolean) => RoomMember
}

interface PushMessageOptions {
  body?: string
  sender?: string
  ts?: number
  eventId?: string
}

interface PushReactionOptions {
  sender?: string
  ts?: number
  eventId?: string
}

interface CreateMockRoomOptions {
  id: string
  seedMessages?: number
}

export function createMockRoom(opts: CreateMockRoomOptions): MockRoom {
  const { id, seedMessages = 0 } = opts

  const events: MatrixEvent[] = []
  const annotationsByTarget = new Map<string, Map<string, Set<MatrixEvent>>>()
  const members = new Map<string, RoomMember>()

  let nextTs = DEFAULT_START_TS

  const timelineSet = {
    relations: {
      getChildEventsForEvent: (eventId: string, relType: string, eventType: string) => {
        if (relType !== 'm.annotation' || eventType !== 'm.reaction') return
        const byKey = annotationsByTarget.get(eventId)
        if (!byKey) return
        return {
          getSortedAnnotationsByKey: () => byKey,
          off: () => {},
          on: () => {},
        }
      },
    },
  }

  const room = {
    findEventById: (eventId: string) => events.find(e => e.getId() === eventId),
    getJoinedMembers: () => [],
    getLiveTimeline: () => ({
      getEvents: () => events,
      getPaginationToken: () => 'token',
    }),
    getMember: (userId: string) => {
      const member = members.get(userId)
      if (member) return member

      const stub = new RoomMember(id, userId)
      ;(stub as unknown as { membership: string }).membership = KnownMembership.Join
      return stub
    },
    getMembers: () => [...members.values()],
    getUnfilteredTimelineSet: () => timelineSet,
    loadMembersIfNeeded: async () => {},
    membersLoaded: () => true,
    name: `Mock room: ${id}`,
    off: () => {},
    on: () => {},
    roomId: id,
  } as unknown as Room
  Object.setPrototypeOf(room, Room.prototype)

  const pushMessage: MockRoom['pushMessage'] = (msgOpts = {}) => {
    const i = events.length
    const eventId = msgOpts.eventId ?? `$msg-${id}-${i}`
    const ts = msgOpts.ts ?? nextTs++
    const sender = msgOpts.sender ?? DEFAULT_SENDER
    const body = msgOpts.body ?? `Event ${eventId} (${i})`
    const content = { body, msgtype: 'm.text' }

    const event = mkStubEvent({
      content,
      eventId,
      roomId: id,
      sender,
      ts,
      type: 'm.room.message',
    })
    events.push(event)
    return event
  }

  const pushReaction: MockRoom['pushReaction'] = (target, key, rxOpts = {}) => {
    const targetId = target.getId()
    if (!targetId) throw new Error('pushReaction: target event has no id')

    const i = events.length
    const eventId = rxOpts.eventId ?? `$rx-${id}-${i}`
    const ts = rxOpts.ts ?? nextTs++
    const sender = rxOpts.sender ?? DEFAULT_SENDER
    const content = {
      'm.relates_to': { event_id: targetId, key, rel_type: 'm.annotation' },
    }

    const event = mkStubEvent({
      content,
      eventId,
      roomId: id,
      sender,
      ts,
      type: 'm.reaction',
    })

    let byKey = annotationsByTarget.get(targetId)
    if (!byKey) annotationsByTarget.set(targetId, (byKey = new Map()))
    let set = byKey.get(key)
    if (!set) byKey.set(key, (set = new Set()))
    set.add(event)

    events.push(event)
    return event
  }

  const setMemberTyping: MockRoom['setMemberTyping'] = (userId, typing) => {
    let member = members.get(userId)
    if (!member) {
      member = new RoomMember(id, userId)
      members.set(userId, member)
    }
    ;(member as unknown as { typing: boolean }).typing = typing
    return member
  }

  const redact: MockRoom['redact'] = event => {
    ;(event as unknown as { isRedacted: () => boolean }).isRedacted = () => true
  }

  for (let i = 0; i < seedMessages; i++) {
    const eventId = i === 0 ? 'oldest-event' : i === seedMessages - 1 ? 'newest-event' : undefined
    pushMessage({ eventId })
  }

  return { pushMessage, pushReaction, redact, room, setMemberTyping }
}

interface StubEventInput {
  eventId: string
  roomId: string
  sender: string
  ts: number
  type: string
  content: Record<string, unknown>
}

function mkStubEvent(input: StubEventInput): MatrixEvent {
  const { content, eventId, roomId, sender, ts, type } = input

  const event: Partial<Record<keyof MatrixEvent, unknown>> = {
    event: { content, type },
    getClearContent: () => content,
    getContent: () => content,
    getId: () => eventId,
    getRoomId: () => roomId,
    getSender: () => sender,
    getTs: () => ts,
    getType: () => type,
    isBeingDecrypted: () => false,
    isDecryptionFailure: () => false,
    isEncrypted: () => false,
    isRedacted: () => false,
    off: () => {},
    on: () => {},
  }

  const stub = event as unknown as MatrixEvent
  Object.setPrototypeOf(stub, MatrixEvent.prototype)
  return stub
}
