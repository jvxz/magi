const TYPING_REFRESH_TIMEOUT = TYPING_TIMEOUT_MS - 1000

export const useRoomMembersTyping = createProvidableComposable(
  'useRoomMembersTyping',
  (roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) => {
    const room = useRoom(roomOrId)

    const typingMembers = shallowRef<Set<string>>(new Set())
    const areMembersTyping = computed(() => typingMembers.value.size > 0)

    const { typing } = useRoomActions(room)
    const startTyping = throttle(() => typing.mutate({ isTyping: true }), TYPING_REFRESH_TIMEOUT, {
      edges: ['leading'],
    })
    const stopTyping = debounce(() => typing.mutate({ isTyping: false }), TYPING_REFRESH_TIMEOUT)

    function onType(forceStop?: true) {
      if (forceStop) {
        startTyping.cancel()
        stopTyping.flush()
        return
      }

      startTyping()
      stopTyping()
    }

    const { self } = useSelf()
    const setTypingMembers = (members: string[]) => {
      typingMembers.value = new Set(members.filter(u => u !== self.value?.userId))
    }

    useRoomHooks(room, {
      onRoomMemberTyping: event => setTypingMembers(event.getContent<{ user_ids?: string[] }>().user_ids ?? []),
    })

    watch(
      room,
      room => {
        if (room) setTypingMembers([...getRoomMembersTyping(room)])
      },
      { immediate: true },
    )

    return {
      areMembersTyping,
      onType,
      typingMembers,
    }
  },
)
