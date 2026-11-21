import type { Faker } from '@faker-js/faker'
import type { IContent, IEvent, IUnsigned } from 'matrix-js-sdk'
import type { RoomMember } from 'matrix-js-sdk/lib/models/room-member'

import { faker } from '@faker-js/faker'
import { sample } from 'es-toolkit'
import { EventType, KnownMembership, MatrixEvent } from 'matrix-js-sdk'
import { withoutProtocol } from 'ufo'

import { objectKeys } from '~/utils/object'

export const DEFAULT_MOCK_NAMES = Array.from({ length: 50 }, (_, i) => {
  faker.seed(50 - (i + 1))
  return generateFakeUserId()
})

function generateFakeRoomId(customFaker?: Faker) {
  return `!${(customFaker ?? faker).word.sample()}.${generateFakeHomeserver()}`
}

export function generateFakeUserId(customFaker?: Faker) {
  return `@${(customFaker ?? faker).internet.username()}:${generateFakeHomeserver()}`
}

export function generateFakeHomeserver(customFaker?: Faker) {
  return withoutProtocol((customFaker ?? faker).internet.url({ appendSlash: false }))
}

function generateFakeEventId(customFaker?: Faker) {
  return `$${(customFaker ?? faker).number.float()}-${(customFaker ?? faker).number.float()}`
}

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
