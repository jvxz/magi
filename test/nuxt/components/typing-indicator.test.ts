import { MatrixEvent, RoomMember, RoomMemberEvent } from 'matrix-js-sdk'
import { beforeEach, describe, expect, it } from 'vitest'
import { mockClient } from '~~/test/utils/client'
import { DEFAULT_MOCK_NAMES } from '~~/test/utils/factories'
import { withSetup } from '~~/test/utils/mount'

const CURRENT_USER = DEFAULT_MOCK_NAMES[0]!

let mockRoom: MockRoom
let client: ReturnType<typeof mockClient>

const emitTyping = (userIds: string[]) =>
  client.emit(
    RoomMemberEvent.Typing,
    new MatrixEvent({ content: { user_ids: userIds }, type: 'm.typing' }),
    new RoomMember(mockRoom.room.roomId, userIds[0] ?? CURRENT_USER),
  )

const mountTyping = () => withSetup(() => useRoomMembersTyping(() => mockRoom.room))

describe('typing indicator', () => {
  let roomSeq = 0

  beforeEach(() => {
    mockRoom = createMockRoom({ id: `typing-${roomSeq++}` })
    client = mockClient({ rooms: [mockRoom], userId: CURRENT_USER })
  })

  it('captures user_ids from a typing event', async () => {
    const typing = DEFAULT_MOCK_NAMES.slice(1, 3)

    const setup = await mountTyping()
    emitTyping(typing)
    await nextTick()

    expect([...setup.typingMembers.value].toSorted()).toEqual(typing.toSorted())
    expect(setup.areMembersTyping.value).toBe(true)
  })

  it('does not display current user in typing indicator list', async () => {
    const setup = await mountTyping()
    emitTyping(DEFAULT_MOCK_NAMES.slice(0, 3))
    await nextTick()

    expect([...setup.typingMembers.value]).not.toContain(CURRENT_USER)
    expect(setup.typingMembers.value.size).toBe(2)
  })

  it('displays typing members from the initial room load', async () => {
    const typing = DEFAULT_MOCK_NAMES.slice(1, 2)
    typing.forEach(m => mockRoom.setMemberTyping(m, true))
    mockRoom.setMemberTyping(DEFAULT_MOCK_NAMES[2]!, false)

    const setup = await mountTyping()

    expect([...setup.typingMembers.value].toSorted()).toEqual(typing.toSorted())
  })
})
