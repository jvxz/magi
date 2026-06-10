import type { MatrixEvent } from 'matrix-js-sdk'

import { EventType, MatrixEventEvent, RelationsEvent, RelationType } from 'matrix-js-sdk'

export function useRoomEventHasReactions(
  roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>,
  eventOrId: MaybeRefOrGetter<MatrixEvent | undefined>,
) {
  const room = useRoom(roomOrId)
  const has = shallowRef(false)

  watch(
    [room, () => toValue(eventOrId)],
    ([r, event]) => {
      if (!r || !event) {
        has.value = false
        return
      }

      const get = () => (has.value = !!getEventReactions(r, event)?.size)
      get()

      let relations = getEventRelations(r, event, RelationType.Annotation, EventType.Reaction)

      const subscribe = (rels: typeof relations) => {
        rels?.on(RelationsEvent.Add, get)
        rels?.on(RelationsEvent.Remove, get)
        rels?.on(RelationsEvent.Redaction, get)
      }

      const onCreated = () => {
        relations = getEventRelations(r, event, RelationType.Annotation, EventType.Reaction)
        subscribe(relations)
        get()
      }

      if (relations) subscribe(relations)
      else event.once(MatrixEventEvent.RelationsCreated, onCreated)

      onWatcherCleanup(() => {
        event.off(MatrixEventEvent.RelationsCreated, onCreated)
        relations?.off(RelationsEvent.Add, get)
        relations?.off(RelationsEvent.Remove, get)
        relations?.off(RelationsEvent.Redaction, get)
      })
    },
    { immediate: true },
  )

  return has
}
