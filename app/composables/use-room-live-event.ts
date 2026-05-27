import type { MatrixEvent } from 'matrix-js-sdk'
import type { EffectScope, ShallowRef } from 'vue'

import { EventType, MatrixEventEvent, RelationsEvent, RelationType } from 'matrix-js-sdk'

type Key = `${string}:${string}`

interface Entry {
  scope: EffectScope
  ref: ShallowRef<MatrixEvent | undefined>
  subs: number
}

const cache = new Map<Key, Entry>()

function createKey(roomId: string, eventId: string) {
  return `${roomId}:${eventId}` as const
}

function acquire(roomId: string, eventId: string) {
  const key = createKey(roomId, eventId)

  let entry = cache.get(key)
  if (!entry) {
    const scope = effectScope(true)

    const ref = scope.run(() => {
      const room = useRoom(roomId)

      const getEvent = () => {
        if (!room.value) return undefined
        const event = room.value.findEventById(eventId)
        return event ? markRaw(event) : undefined
      }

      const source = shallowRef<MatrixEvent | undefined>(getEvent())
      const event = shallowRef<MatrixEvent | undefined>(source.value)

      const update = throttle(() => {
        const next = getEvent()
        if (next !== source.value) source.value = next
        event.value = next
        triggerRef(event)
      }, 50)

      watch(
        source,
        event => {
          if (!event) return

          event.on(MatrixEventEvent.Replaced, update)
          event.on(MatrixEventEvent.BeforeRedaction, update)
          event.on(MatrixEventEvent.Decrypted, update)
          event.on(MatrixEventEvent.VisibilityChange, update)

          let relations = room.value
            ? getEventRelations(room.value, event, RelationType.Annotation, EventType.Reaction)
            : undefined

          const subscribeRelations = (rels: typeof relations) => {
            rels?.on(RelationsEvent.Add, update)
            rels?.on(RelationsEvent.Remove, update)
            rels?.on(RelationsEvent.Redaction, update)
          }

          const onRelationsCreated = () => {
            relations = room.value
              ? getEventRelations(room.value, event, RelationType.Annotation, EventType.Reaction)
              : undefined
            subscribeRelations(relations)
            update()
          }

          if (!relations) event.once(MatrixEventEvent.RelationsCreated, onRelationsCreated)
          else subscribeRelations(relations)

          onWatcherCleanup(() => {
            event.off(MatrixEventEvent.Replaced, update)
            event.off(MatrixEventEvent.BeforeRedaction, update)
            event.off(MatrixEventEvent.Decrypted, update)
            event.off(MatrixEventEvent.RelationsCreated, onRelationsCreated)
            event.off(MatrixEventEvent.VisibilityChange, update)

            relations?.off(RelationsEvent.Add, update)
            relations?.off(RelationsEvent.Remove, update)
            relations?.off(RelationsEvent.Redaction, update)
          })
        },
        { immediate: true },
      )

      useRoomHooks(room, {
        onTimeline: e => {
          if (source.value) return
          if (e.getId() === eventId) update()
        },

        onTimelineRefresh: () => {
          if (source.value) update()
        },
        onTimelineReset: () => {
          if (source.value) update()
        },
      })

      return event
    })!

    entry = { ref, scope, subs: 0 }
    cache.set(key, entry)
  }
  entry.subs++
  return entry
}

function release(key: Key) {
  const entry = cache.get(key)
  if (!entry) return

  entry.subs--
  if (entry.subs <= 0) {
    entry.scope.stop()
    cache.delete(key)
  }
}

export function useRoomLiveEvent(
  roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>,
  eventOrId: MaybeRefOrGetter<MaybeEventOrId | undefined>,
) {
  const roomIdRef = useResolveRoomId(roomOrId)
  const eventIdRef = useResolveEventId(eventOrId)

  const event = shallowRef<MatrixEvent>()

  watch(
    [roomIdRef, eventIdRef],
    () => {
      const roomId = roomIdRef.value
      const eventId = eventIdRef.value

      if (!roomId || !eventId) {
        event.value = undefined
        return
      }

      const entry = acquire(roomId, eventId)

      const { stop } = watch(
        entry.ref,
        value => {
          event.value = value
          triggerRef(event)
        },
        { immediate: true },
      )

      onWatcherCleanup(() => {
        stop()
        release(createKey(roomId, eventId))
      })
    },
    { immediate: true },
  )

  return event
}
