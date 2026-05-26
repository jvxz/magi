export const useRoomMembersTyping = createProvidableComposable(
  'useRoomMembersTyping',
  (roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) => {
    const room = useRoom(roomOrId)

    const typingMembers = shallowRef<Set<string>>(new Set())
    const areMembersTyping = computed(() => typingMembers.value.size > 0)

    const { self } = useSelf()
    const setTypingMembers = (members: string[]) => {
      typingMembers.value = new Set(members.filter(u => u !== self.value?.userId))
    }

    useRoomHooks(room, {
      onRoomMemberTyping: event => setTypingMembers(event.getContent<{ user_ids?: string[] }>().user_ids ?? []),
    })

    whenever(
      () => room.value,
      room => setTypingMembers([...getRoomMembersTyping(room)]),
      { immediate: true, once: true },
    )

    return {
      areMembersTyping,
      typingMembers,
    }
  },
)
