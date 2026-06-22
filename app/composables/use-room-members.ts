import type { RoomMember } from 'matrix-js-sdk'

import { EventType } from 'matrix-js-sdk'

export function useRoomMembers(
  maybeRoomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>,
  excludeSelf?: MaybeRefOrGetter<boolean>,
) {
  const room = useRoom(maybeRoomOrId)
  const excludeSelfRef = toRef(excludeSelf)
  const { self } = useSelf()
  const members = shallowRef<RoomMember[]>([])
  const isLoaded = ref(false)

  const setMembers = debounce((newMembers: RoomMember[]) => {
    if (excludeSelfRef.value) members.value = [...newMembers].filter(m => m.userId !== self.value?.userId)
    else members.value = newMembers
  }, 0)

  let loadToken = 0
  watch(
    () => room.value?.roomId,
    async () => {
      const r = room.value
      const token = ++loadToken

      if (!r) {
        setMembers([])
        isLoaded.value = false
        return
      }

      if (r.membersLoaded()) {
        setMembers(r.getJoinedMembers())
        isLoaded.value = true
        return
      }

      setMembers([])
      isLoaded.value = false

      await r.loadMembersIfNeeded()
      if (token !== loadToken || room.value?.roomId !== r.roomId) return

      setMembers(r.getJoinedMembers())
      isLoaded.value = true
    },
    { immediate: true },
  )

  useRoomHooks(room, {
    onMemberUpdate: (event, roomState) => {
      if (!room.value || room.value.roomId !== roomState.roomId || !isLoaded.value) return

      if (event.getType() !== EventType.RoomMember && event.getType() !== EventType.RoomPowerLevels) return

      setMembers(room.value.getJoinedMembers())
    },
  })

  return { isLoaded, members }
}
