export const useRoomMembersTyping = createProvidableComposable(
  'useRoomMembersTyping',
  (roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) => {
    const room = useRoom(roomOrId)

    const typingMembers = shallowRef<Set<string>>(new Set())
    const areMembersTyping = computed(() => typingMembers.value.size > 0)

    const { self } = useSelf()
    useRoomHooks(room, {
      onRoomMemberTyping: event => {
        typingMembers.value = new Set(
          event.getContent<{ user_ids: string[] }>().user_ids.filter(u => u !== self.value?.userId),
        )
      },
    })

    whenever(
      () => room.value,
      room => (typingMembers.value = getRoomMembersTyping(room)),
      { immediate: true, once: true },
    )

    return {
      areMembersTyping,
      typingMembers,
    }
  },
)
