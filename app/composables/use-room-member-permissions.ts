import type { RoomState } from 'matrix-js-sdk'

import { EventType } from 'matrix-js-sdk'

export function useRoomMemberPermissions(
  roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>,
  userOrId: MaybeRefOrGetter<MaybeUserOrId | undefined>,
) {
  const userId = useResolveUserId(userOrId)
  const roomState = useRoomState(roomOrId)
  const roomCreators = useRoomCreators(roomOrId)

  const powerLevelOf = (s: RoomState, id: string) => s.getMember(id)?.powerLevel ?? 0

  const check = (fn: (state: RoomState, userId: string) => boolean) =>
    computed(() => {
      if (!!userId.value && roomCreators.value.has(userId.value)) return true
      return !!roomState.value && !!userId.value && fn(roomState.value, userId.value)
    })

  // computed function factory to judge powerlevel against another member
  const checkAgainst = (canAct: ComputedRef<boolean>) => (targetOrId: MaybeRefOrGetter<MaybeUserOrId | undefined>) => {
    const targetId = useResolveUserId(targetOrId)
    return computed(() => {
      const id = userId.value
      const target = targetId.value
      if (!roomState.value || !id || !target || id === target) return false
      return canAct.value && powerLevelOf(roomState.value, target) < powerLevelOf(roomState.value, id)
    })
  }

  const canKick = check((s, userId) => s.hasSufficientPowerLevelFor('kick', powerLevelOf(s, userId)))
  const canBan = check((s, userId) => s.hasSufficientPowerLevelFor('ban', powerLevelOf(s, userId)))
  const canBanUser = checkAgainst(canBan)
  const canKickUser = checkAgainst(canKick)

  const canChangeName = check((s, userId) => s.maySendStateEvent(EventType.RoomName, userId))
  const canSendMessages = check((s, userId) => s.maySendMessage(userId))
  const canRedactMessages = check((s, userId) => s.hasSufficientPowerLevelFor('redact', powerLevelOf(s, userId)))
  const canRedactOwnMessages = check((s, userId) => s.maySendEvent(EventType.RoomRedaction, userId))

  return {
    canBan,
    canBanUser,
    canChangeName,
    canKick,
    canKickUser,
    canRedactMessages,
    canRedactOwnMessages,
    canSendMessages,
  }
}
