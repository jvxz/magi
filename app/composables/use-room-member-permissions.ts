import type { RoomState } from 'matrix-js-sdk'

import { EventType } from 'matrix-js-sdk'

export function useRoomMemberPermissions(
  roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>,
  userOrId: MaybeRefOrGetter<MaybeUserOrId | undefined>,
) {
  const userId = useResolveUserId(userOrId)
  const roomState = useRoomState(roomOrId)
  const { self } = useSelf()

  const check = (fn: (state: RoomState, userId: string) => boolean) =>
    computed(() => !!roomState.value && !!userId.value && fn(roomState.value, userId.value))

  const powerLevel = (s: RoomState, id: string) => s.getMember(id)?.powerLevel ?? 0

  const canKick = check((s, userId) => s.hasSufficientPowerLevelFor('kick', powerLevel(s, userId)))
  const canBan = check((s, userId) => {
    if (!self.value || userId === self.value.userId) return false // cannot ban self
    return s.hasSufficientPowerLevelFor('ban', powerLevel(s, userId))
  })
  const canChangeName = check((s, userId) => s.maySendStateEvent(EventType.RoomName, userId))
  const canSendMessages = check((s, userId) => s.maySendMessage(userId))

  return {
    canBan,
    canChangeName,
    canKick,
    canSendMessages,
  }
}
