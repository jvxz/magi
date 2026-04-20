import { describe, expect, it } from 'vitest'
import { parseMembershipEvent } from '../../../app/utils/matrix/events'
import { generateMembershipEvents } from '../utils/events'

const events = generateMembershipEvents(128)

describe('parsing', () => {
  it('correctly parses membership events', () => {
    const parsed = events.map(parseMembershipEvent)

    const types = parsed.map(e => e.type)

    expect.soft(types).not.toContain('unknown')
  })
})
