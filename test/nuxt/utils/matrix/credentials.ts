import type { Faker } from '@faker-js/faker'

import { faker } from '@faker-js/faker'

export const DEFAULT_MOCK_NAMES = Array.from({ length: 50 }, (_, i) => {
  faker.seed(50 - (i + 1))
  return generateFakeUserId()
})

export function generateFakeRoomId(customFaker?: Faker) {
  return `!${(customFaker ?? faker).word.sample()}.${generateFakeHomeserver()}`
}

export function generateFakeUserId(customFaker?: Faker) {
  return `@${(customFaker ?? faker).internet.username()}:${generateFakeHomeserver()}`
}

export function generateFakeHomeserver(customFaker?: Faker) {
  return withoutProtocol((customFaker ?? faker).internet.url({ appendSlash: false }))
}

export function generateFakeEventId(customFaker?: Faker) {
  return `$${(customFaker ?? faker).number.float()}-${(customFaker ?? faker).number.float()}`
}
