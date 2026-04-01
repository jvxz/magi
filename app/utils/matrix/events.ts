import type { EventType, MatrixEvent } from 'matrix-js-sdk'

type Predicate = EventType | string | ((event: MatrixEvent) => boolean)

export function filterMatrixEvents(events: MatrixEvent[], predicate: Predicate) {
  const filtered: MatrixEvent[] = []

  for (const event of events) {
    if (typeof predicate === 'function' ? predicate(event) : event.getType() === predicate)
      filtered.push(event)
  }

  return filtered
}
