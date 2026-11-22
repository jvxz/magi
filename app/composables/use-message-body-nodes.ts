import type { MatrixEvent } from 'matrix-js-sdk'
import type { RoomMessageTextEventContent } from 'matrix-js-sdk/lib/types'

import { EventType } from 'matrix-js-sdk'

const cache = new WeakMap<object, MessageNode[]>()

export function useMessageBodyNodes(event: MaybeRefOrGetter<MatrixEvent>) {
  const eventRef = toRef(event)

  const messageNodes = computed<MessageNode[]>(() => {
    assert(
      [EventType.RoomMessage, EventType.Sticker, EventType.RoomMessageEncrypted].includes(
        eventRef.value.getType() as EventType,
      ),
      `invalid event type when formatting message body. was \`\${eventRef.value.getType()}\``,
    )

    const content = eventRef.value.getContent<RoomMessageTextEventContent>()
    const { body, format, formatted_body } = content
    if (format !== 'org.matrix.custom.html' || !formatted_body) return splitEmojiText(body)

    let nodes = cache.get(content)
    if (!nodes) {
      nodes = createMessageNodes(
        sanitizeFormattedBody(formatted_body, { ADD_FORBID_CONTENTS: ['mx-reply'], RETURN_DOM: true }),
      )
      cache.set(content, nodes)
    }

    return nodes
  })

  return {
    messageNodes,
  }
}
