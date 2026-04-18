import type { MatrixEvent } from 'matrix-js-sdk'

interface GroupedEvent {
  events: MatrixEvent[]
  grouped: boolean[]
}

interface Opts {
  events: Ref<MatrixEvent[]>
  eventsPaginated: Ref<MatrixEvent[]>
}

export function useEventGrouping(opts: Opts) {
  const groupedEvents = computed<GroupedEvent>(() => {
    const { events: rawEvents, eventsPaginated } = opts

    let prevEvent = getPreviousEvent(rawEvents.value, eventsPaginated.value[0])
    let currentGroupTsCutoff = -1

    const events: MatrixEvent[] = []
    const grouped: GroupedEvent['grouped'] = []

    const GROUP_WINDOW_MS = 15 * 60 * 1000

    for (let i = 0; i < eventsPaginated.value.length; i++) {
      const event = eventsPaginated.value[i]
      assert(event, '`event` was undefined when looping over paginated events to group')

      const sameSender = prevEvent && event.getSender() === prevEvent.getSender()
      const sameEventType = prevEvent && event.getType() === prevEvent.getType()
      const isReply = checkReplyEvent(event)
      const withinWindow = currentGroupTsCutoff !== -1 && event.getTs() < currentGroupTsCutoff
      const shouldGroup = !!(sameSender && sameEventType && withinWindow && !isReply)

      if (!shouldGroup)
        currentGroupTsCutoff = event.getTs() + GROUP_WINDOW_MS

      grouped.push(shouldGroup)
      events.push(event)

      prevEvent = event
    }

    return { events, grouped }
  })

  return groupedEvents
}

function getPreviousEvent(eventList: MatrixEvent[], event: MatrixEvent | undefined) {
  if (!event)
    return

  for (let i = 0; i < eventList.length; i++) {
    const eventTarget = eventList[i]
    assert(eventTarget, '`eventTarget` was undefined when getting previous event')

    if (eventTarget.getId() === event.getId())
      return eventList.at(i - 1)
  }
}
