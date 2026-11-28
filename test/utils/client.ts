import { createClient, User } from 'matrix-js-sdk'
import { vi } from 'vitest'

import type { MockRoom } from '~/utils/test/mock-room'

import { DEFAULT_MOCK_NAMES, generateFakeHomeserver } from './factories'

interface MockClientOptions {
  rooms?: MockRoom[]
  userId?: string
}

export function mockClient({ rooms = [], userId = DEFAULT_MOCK_NAMES[0]! }: MockClientOptions = {}) {
  const client = Object.assign(createClient({ baseUrl: generateFakeHomeserver() }), {
    getJoinedRooms: () => rooms.map(r => r.room.roomId),
    getRoom: (id: string) => rooms.find(r => r.room.roomId === id)?.room ?? null,
    getSafeUserId: () => userId,
    getUser: (id: string) => new User(id),
    getUserId: () => userId,
    redactEvent: vi.fn(),
    sendEvent: vi.fn(),
  })

  useMatrixClient().client.value = client
  return client
}
