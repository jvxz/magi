import type { Room, RoomMember } from 'matrix-js-sdk'
import { EventType, KnownMembership } from 'matrix-js-sdk'

export function useRoomMembers(maybeRoomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const room = useRoom(maybeRoomOrId)
  const members = shallowRef<RoomMember[]>([])
  const isLoaded = ref(false)

  const setMembers = debounce((newMembers: RoomMember[]) => members.value = newMembers, 0)

  let loadToken = 0
  watch(() => room.value?.roomId, async () => {
    const r = room.value
    const token = ++loadToken

    if (!r) {
      setMembers([])
      isLoaded.value = false
      return
    }

    if (r.membersLoaded()) {
      setMembers(getMembers(r))
      isLoaded.value = true
      return
    }

    setMembers([])
    isLoaded.value = false

    await r.loadMembersIfNeeded()
    if (token !== loadToken || room.value?.roomId !== r.roomId)
      return

    setMembers(getMembers(r))
    isLoaded.value = true
  }, { immediate: true })

  useRoomEventHooks(room, {
    onMemberUpdate: (event, roomState) => {
      if (!room.value || room.value.roomId !== roomState.roomId || !isLoaded.value)
        return

      if (event.getType() !== EventType.RoomMember && event.getType() !== EventType.RoomPowerLevels)
        return

      setMembers(getMembers(room.value))
    },
  })

  return { isLoaded, members }
}

function getMembers(room: Room) {
  const members = room.getMembers() ?? []

  return members.filter(member => member.membership === KnownMembership.Join)
}
