import type { IContent, IEvent, IUnsigned } from 'matrix-js-sdk'
import type { RoomMember } from 'matrix-js-sdk/lib/models/room-member'

import { objectKeys } from '#shared/utils/object'
import { sample } from 'es-toolkit'
import { EventType, KnownMembership, MatrixEvent } from 'matrix-js-sdk'

import { generateFakeEventId, generateFakeRoomId, generateFakeUserId } from './credentials'

export function generateMembershipEvents(count: number) {
  return Array.from({ length: count }, () =>
    mkMatrixEvent({
      content: {
        membership: KnownMembership[sample(objectKeys(KnownMembership))],
      },
      eventId: generateFakeEventId(),
      roomId: generateFakeRoomId(),
      sender: generateFakeUserId(),
      stateKey: generateFakeUserId(),
      type: EventType.RoomMember,
    }),
  )
}

function mkMatrixEvent(opts: {
  roomId: string
  sender: string
  type: EventType | string
  stateKey?: string
  ts?: number
  eventId?: string
  content: IContent
  unsigned?: IUnsigned
}): MatrixEvent {
  const event: Partial<IEvent> = {
    content: opts.content,
    event_id: opts.eventId ?? `$${Math.random()}-${Math.random()}`,
    origin_server_ts: opts.ts ?? 0,
    room_id: opts.roomId,
    sender: opts.sender,
    type: opts.type,
    unsigned: opts.unsigned,
  }
  if (opts.stateKey !== undefined) event.state_key = opts.stateKey

  const mxEvent = new MatrixEvent(event)
  mxEvent.sender = {
    getAvatarUrl: () => {},
    getMxcAvatarUrl: () => {},
    membership: 'join',
    name: opts.sender,
    rawDisplayName: opts.sender,
    roomId: opts.sender,
    userId: opts.sender,
  } as unknown as RoomMember
  return mxEvent
}
