export function useRoomInviteActions(roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const roomId = useResolveRoomId(roomOrId)
  const { invite: inviteAction, join, leave } = useRoomActions(roomId)

  const invite = {
    ...reactiveOmit(inviteAction, ['isPending', 'status']),
    isPending: useIsKeyMutating('invite', roomId),
  }

  const accept = {
    ...reactiveOmit(join, ['isPending', 'status']),
    isPending: useIsKeyMutating('joinRoom', roomId),
  }

  const decline = {
    ...reactiveOmit(leave, ['isPending', 'status']),
    isPending: useIsKeyMutating('leaveRoom', roomId),
  }

  return {
    accept,
    decline,
    invite,
  }
}
