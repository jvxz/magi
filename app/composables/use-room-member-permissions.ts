import type { RoomState } from 'matrix-js-sdk'

import { EventType } from 'matrix-js-sdk'

export function useRoomMemberPermissions(
  roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>,
  userOrId: MaybeRefOrGetter<MaybeUserOrId | undefined>,
) {
  const userId = useResolveUserId(userOrId)
  const roomState = useRoomState(roomOrId)
  const roomCreators = useRoomCreators(roomOrId)
  const { self } = useSelf()

  const check = (fn: (state: RoomState, userId: string) => boolean, allowCreator = true) =>
    computed(() => {
      if (!!userId.value && allowCreator && roomCreators.value.has(userId.value)) return true
      return !!roomState.value && !!userId.value && fn(roomState.value, userId.value)
    })

  const powerLevel = (s: RoomState, id: string) => s.getMember(id)?.powerLevel ?? 0

  const canKick = check((s, userId) => s.hasSufficientPowerLevelFor('kick', powerLevel(s, userId)))
  const canBan = check((s, userId) => {
    if (!self.value || userId === self.value.userId) return false // cannot ban self
    if (roomCreators.value.has(userId)) return true
    return s.hasSufficientPowerLevelFor('ban', powerLevel(s, userId))
  }, false)
  const canChangeName = check((s, userId) => s.maySendStateEvent(EventType.RoomName, userId))
  const canSendMessages = check((s, userId) => s.maySendMessage(userId))
  const canRedactMessages = check((s, userId) => s.hasSufficientPowerLevelFor('redact', powerLevel(s, userId)))
  const canRedactOwnMessages = check((s, userId) => s.maySendEvent(EventType.RoomRedaction, userId))

  return {
    canBan,
    canChangeName,
    canKick,
    canRedactMessages,
    canRedactOwnMessages,
    canSendMessages,
  }
}
