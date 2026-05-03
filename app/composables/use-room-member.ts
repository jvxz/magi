export function useRoomMember(maybeRoomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>, maybeUserOrId: MaybeRefOrGetter<MaybeUserOrId | undefined>) {
  const room = useRoom(maybeRoomOrId)

  const member = computed(() => {
    const user = toValue(maybeUserOrId)
    if (!user)
      return

    const id = resolveUserId(user)
    return room.value?.getMember(id) ?? undefined
  })

  return member
}
