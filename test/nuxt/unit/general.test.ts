import { describe, expect, it } from 'vitest'
import { mockClient } from '~~/test/utils/client'

describe('general', () => {
  it('generates valid matrix.to url', async () => {
    const roomId = '!foobar:magi.social'
    const roomAlias = '#foobar:magi.social'
    const userId = '@admin:magi.social'
    const eventId = '$foobar123'

    const mockRoom = createMockRoom({ alias: roomAlias, id: roomId, seedMembers: 16 })
    const { addMember, room } = mockRoom
    const client = mockClient({ rooms: [mockRoom] })

    addMember(userId, { powerLevel: 100 })

    const roomIdUrl = getMatrixToUrl(client, 'roomId', roomId)
    expect(roomIdUrl.startsWith(`https://matrix.to/#/${roomId}`)).toBe(true)
    expect(roomIdUrl.startsWith(`https://matrix.to/#/${roomId}?via=magi.social`)).toBe(true)

    const roomIdUrlNoVia = getMatrixToUrl(client, 'roomId', roomId, { viaServers: false })
    expect(roomIdUrlNoVia.startsWith(`https://matrix.to/#/${roomId}`)).toBe(true)
    expect(roomIdUrlNoVia.startsWith(`https://matrix.to/#/${roomId}?via=magi.social`)).toBe(false)

    const roomAliasUrl = getMatrixToUrl(client, 'roomAlias', room.getCanonicalAlias() ?? '')
    expect(roomAliasUrl.startsWith(`https://matrix.to/#/${roomAlias}`)).toBe(true)
    expect(roomAliasUrl.includes('?')).toBe(false)

    const userIdUrl = getMatrixToUrl(client, 'userId', userId)
    expect(userIdUrl.startsWith(`https://matrix.to/#/${userId}`)).toBe(true)

    const eventUrl = getMatrixToUrl(client, 'event', roomId, {
      eventId,
    })
    expect(eventUrl.startsWith(`https://matrix.to/#/${roomId}/${eventId}`)).toBe(true)
  })
})
