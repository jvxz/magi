import { mountSuspended } from '@nuxt/test-utils/runtime'
import { DOMWrapper } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { mockClient } from '~~/test/utils/client.ts'
import { DEFAULT_MOCK_NAMES } from '~~/test/utils/factories.ts'
import { withSetup } from '~~/test/utils/mount.ts'

import { DialogReactionsViewer, UProfilePopoverRoot } from '#components'

import Reactions from '../fixtures/reactions.vue'

const [FIRST_REACTION] = GENERAL__DEFAULT_RECENT_REACTIONS as [string, ...string[]]

const reactionItemSelector = (reaction: string | undefined) => `[data-slot="reaction-item"][reaction="${reaction}"]`

const findReactionItem = (reaction: string | undefined) =>
  new DOMWrapper(document.querySelector(reactionItemSelector(reaction)))

const mountViewer = async () => {
  const mockRoom = createMockRoom({ id: 'reactionsViewer' })
  mockClient({ rooms: [mockRoom] })

  const target = mockRoom.pushMessage({ body: 'hello' })
  GENERAL__DEFAULT_RECENT_REACTIONS.forEach((v, k) => {
    for (let i = 0; i < k + 1; i++) mockRoom.pushReaction(target, v, { sender: DEFAULT_MOCK_NAMES[i] })
  })

  await mountSuspended(
    defineComponent(
      () => () =>
        h(UProfilePopoverRoot, null, () => h(DialogReactionsViewer, { event: target, open: true, room: mockRoom.room })),
    ),
  )
}

describe('reactions', () => {
  it('displays the dialog with default recent reactions', async () => {
    await mountViewer()

    GENERAL__DEFAULT_RECENT_REACTIONS.forEach(v => expect(findReactionItem(v).exists()).toBe(true))
  })

  it('displays the dialog with the first reaction selected by default', async () => {
    await mountViewer()

    const item = findReactionItem(FIRST_REACTION)
    expect(item.attributes()).toMatchObject({ 'data-state': 'checked', reaction: FIRST_REACTION })
  })

  it('displays the correct reaction member list in the dialog', async () => {
    await mountViewer()

    const reaction = GENERAL__DEFAULT_RECENT_REACTIONS[3]
    const item = findReactionItem(reaction)
    await item.trigger('mousedown')
    await nextTick()

    expect(item.attributes()).toMatchObject({ 'data-state': 'checked', reaction })
  })

  it('displays reaction item under message', async () => {
    const mockRoom = createMockRoom({ id: 'reactions' })
    mockClient({ rooms: [mockRoom] })
    const event = mockRoom.pushMessage()
    mockRoom.pushReaction(event, FIRST_REACTION)

    const component = await mountSuspended(Reactions, { props: { event, room: mockRoom.room } })

    expect(component.find(reactionItemSelector(FIRST_REACTION)).exists()).toBe(true)
  })

  it('successfully reacts to message', async () => {
    const mockRoom = createMockRoom({ id: 'reactions' })
    const { sendEvent } = mockClient({ rooms: [mockRoom] })
    const event = mockRoom.pushMessage()

    const reactions = await withSetup(
      () =>
        useRoomEventReactions(
          () => mockRoom.room,
          () => event,
        ),
      () => h(Reactions, { event, room: mockRoom.room }),
    )
    reactions.reactTo(FIRST_REACTION)

    await vi.waitFor(() =>
      expect(sendEvent).toHaveBeenCalledExactlyOnceWith(
        mockRoom.room.roomId,
        'm.reaction',
        expect.objectContaining({
          'm.relates_to': expect.objectContaining({
            event_id: event.getId(),
            key: FIRST_REACTION,
            rel_type: 'm.annotation',
          }),
        }),
      ),
    )
  })
})
