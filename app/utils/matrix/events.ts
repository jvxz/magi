import type { EventType, IContent, IEvent } from 'matrix-js-sdk'
import { MatrixEvent } from 'matrix-js-sdk'

type Predicate = EventType | string | ((event: MatrixEvent) => boolean)

export function filterMatrixEvents(events: MatrixEvent[], predicate: Predicate) {
  const filtered: MatrixEvent[] = []

  for (const event of events) {
    if (typeof predicate === 'function' ? predicate(event) : event.getType() === predicate)
      filtered.push(event)
  }

  return filtered
}

export function isEditEvent(event: MatrixEvent) {
  const relatesTo = event.getContent()['m.relates_to']
  return relatesTo?.rel_type === 'm.replace' && !!event.getContent()['m.new_content']
}

export function checkReplyEvent(event: MatrixEvent) {
  return event.replyEventId !== undefined
}

export function getEventContent(event: MatrixEvent | undefined): IContent {
  if (!event)
    return { body: 'Could not load event content' }

  const content = event.isEncrypted() ? event.getClearContent() : event.getContent()

  if (event.isEncrypted() && content?.msgtype === 'm.bad.encrypted')
    return { body: 'Unable to decrypt message' }

  if (!content)
    return { body: 'Could not load event content' }

  return content
}

export function canDecryptEvent(event: MatrixEvent | Partial<IEvent> | undefined) {
  if (!event)
    return false

  if (event instanceof MatrixEvent)
    return event.shouldAttemptDecryption()

  const matrixEvent = new MatrixEvent(event)

  return matrixEvent.shouldAttemptDecryption()
}
