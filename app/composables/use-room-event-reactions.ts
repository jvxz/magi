import type { MatrixEvent } from 'matrix-js-sdk'

import { map } from 'es-toolkit/set'

import { injectRoomInstanceContext } from '~/components/room/instance.vue'

export function useRoomEventReactions(
  roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>,
  eventOrId: MaybeRefOrGetter<MatrixEvent | undefined>,
) {
  const room = useRoom(roomOrId)
  const event = useRoomLiveEvent(roomOrId, eventOrId)
  const { bumpRecentReaction } = useRecentReactions()

  const reactions = computed(() => {
    if (!room.value || !event.value) return

    const eventId = event.value.getId()
    assert(eventId, 'eventId was undefined when getting event reactions')

    return getEventReactions(room.value, eventId)
  })

  const { self } = useSelf()
  function isReactingTo(reaction: string) {
    if (!self.value) return
    return isUserReactingTo(self.value, reaction)
  }

  const { react } = injectRoomInstanceContext(null) ?? useRoomActions(room)
  const error = shallowRef<Error | null>(null)
  const pendingRedaction = new Map<string, string>()

  const getDebouncedReactFn = memoize((key: string) =>
    throttle(
      async (shouldReact: boolean, shortcode?: string) => {
        if (!event.value || !MATRIX__REACTABLE_EVENT_TYPES.includes(event.value.getType())) return

        error.value = null
        try {
          await toggle(key, shouldReact, shortcode)
        } catch (e) {
          error.value = e as Error
        }
      },
      400,
      { edges: ['leading', 'trailing'] },
    ),
  )

  async function toggle(key: string, shouldReact: boolean, shortcode?: string) {
    if (!event.value) return

    if (shouldReact) {
      const reactionEvent = isReactingTo(key)
      if (reactionEvent) {
        const reactionEventId = reactionEvent.getId()!

        if (pendingRedaction.get(key) !== reactionEventId) {
          pendingRedaction.set(key, reactionEventId)

          try {
            await react.mutateAsync({ event: event.value, redact: { reactionEvent } })
          } finally {
            pendingRedaction.delete(key)
          }
        }
      }

      await react.mutateAsync({ event: event.value, reaction: key, redact: false, shortcode })
      bumpRecentReaction(key)
    } else {
      const reactionEvent = isReactingTo(key)
      if (!reactionEvent) return

      const id = reactionEvent.getId()!
      if (pendingRedaction.get(key) === id) return

      pendingRedaction.set(key, id)
      try {
        await react.mutateAsync({ event: event.value, redact: { reactionEvent } })
      } finally {
        pendingRedaction.delete(key)
      }
    }
  }

  function reactTo(reaction: string, shouldReact = true, shortcode?: string) {
    if (!event.value || !room.value) return

    const eventId = event.value.getId()
    assert(eventId, `eventId was undefined when toggling reaction to ${reaction}`)

    getDebouncedReactFn(reaction)(shouldReact, shortcode)
  }

  function isUserReactingTo(user: MaybeUserOrId, reaction: string) {
    if (!room.value || !event.value) return

    return isUserReacting(room.value, event.value, user, reaction)
  }

  const getReactors = (reaction: string) => {
    if (!room.value || !event.value) return

    const reactions = getEventReactions(room.value, event.value)
    const reactionEvents = reactions?.get(reaction)?.events
    if (!reactionEvents) return

    return map(reactionEvents, e => e.getSender()!)
  }

  return {
    error,
    event,
    getReactors,
    isReactingTo,
    isUserReactingTo,
    reactTo,
    reactions,
  }
}
