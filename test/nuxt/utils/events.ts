import type { MatrixEvent } from 'matrix-js-sdk'
import { faker } from '@faker-js/faker'
import { sample } from 'es-toolkit'
import { EventType, KnownMembership } from 'matrix-js-sdk'
import { mkMatrixEvent } from 'matrix-js-sdk/src/testing'
import { withoutProtocol } from 'ufo'
import { objectKeys } from '../../../shared/utils/object'

faker.seed(0)

export function generateMembershipEvents(count: number) {
  return Array.from({ length: count }, () => mkMatrixEvent({
    content: {
      membership: KnownMembership[sample(objectKeys(KnownMembership))],
    },
    eventId: generateFakeEventId(),
    roomId: generateFakeRoomId(),
    sender: generateFakeUser(),
    stateKey: generateFakeUser(),
    type: EventType.RoomMember,
  })) as unknown as MatrixEvent[]
}

export function generateFakeRoomId() {
  return `!${faker.word.sample()}.${generateFakeHomeserver()}`
}

function generateFakeUser() {
  return `@${faker.internet.username()}:${generateFakeHomeserver()}`
}

function generateFakeHomeserver() {
  return withoutProtocol(faker.internet.url({ appendSlash: false }))
}

function generateFakeEventId() {
  return `$${faker.number.float()}-${faker.number.float()}`
}
