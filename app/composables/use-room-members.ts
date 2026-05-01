import type { Room, RoomMember } from 'matrix-js-sdk'
import { toRef } from '@vueuse/core'
import { EventType } from 'matrix-js-sdk'
import QuickLRU from 'quick-lru'

const POWER_LEVEL_ORDER = ['admin', 'moderator', 'member'] satisfies PowerLevelName[]

type Member = Pick<RoomMember, 'powerLevel' | 'rawDisplayName' | 'membership' | 'name' | 'userId'> & { type: 'member' }
interface MemberHeader { type: 'header', title: PowerLevelName }
interface MemberCachePayload {
  members: Prettify<Member | MemberHeader>[]
  groupTotals: Record<PowerLevelName, number>
}

const membersCache = new QuickLRU<Room['roomId'], MemberCachePayload>({
  maxSize: 12,
})

export function useRoomMembers(roomId: MaybeRefOrGetter<MaybeRoomOrId | undefined>, includeOffline?: MaybeRefOrGetter<boolean>) {
  const roomIdRef = toRef(roomId)
  const room = useRoom(roomIdRef)
  const includeOfflineRef = refDefault(toRef(includeOffline), false)
  const members = shallowRef<MemberCachePayload>()

  const mutex = new Mutex()
  const updateMembers = debounce(async (force: boolean = false) => {
    await mutex.acquire()
    try {
      if (!room.value)
        return

      // clear the members state to avoid stale data
      members.value = undefined

      const cached = membersCache.get(room.value.roomId)
      if (cached && !force)
        return members.value = cached

      await room.value.loadMembersIfNeeded()

      let membersList = room.value.getMembers()
      if (!includeOfflineRef.value)
        membersList = membersList.filter(m => m.membership === 'join')

      membersList.sort((a, b) => {
        if (a.powerLevel === b.powerLevel) {
          const aName = resolveUserName(a)
          const bName = resolveUserName(b)

          return aName.localeCompare(bName)
        }

        return a.powerLevel > b.powerLevel ? -1 : 1
      })

      const membersGrouped = groupBy(membersList, m => getPowerLevelName(m.powerLevel, true))
      const membersWithHeaders: Prettify<Member | MemberHeader>[] = []
      const groupTotals: MemberCachePayload['groupTotals'] = {
        admin: 0,
        member: 0,
        moderator: 0,
        owner: 0,
      }
      for (const groupName of POWER_LEVEL_ORDER) {
        const group = membersGrouped[groupName]
        if (!group?.length)
          continue

        groupTotals[groupName] = group.length

        membersWithHeaders.push({ title: groupName, type: 'header' })
        for (let i = 0; i < group.length; i++) {
          const member = group[i]
          if (!member)
            continue

          membersWithHeaders.push({ type: 'member', ...member })
        }
      }

      const payload: MemberCachePayload = {
        groupTotals,
        members: membersWithHeaders,
      }

      membersCache.set(room.value.roomId, payload)

      members.value = payload
    }
    finally {
      mutex.release()
    }
  }, 50)

  watch([roomIdRef, includeOfflineRef], () => updateMembers(), { immediate: true })

  useRoomEventHooks(roomId, {
    onMemberUpdate: (event, roomState) => {
      if (
        roomState.roomId !== room.value?.roomId
        || !members.value
        || event.getType() !== EventType.RoomMember
      )
        return

      const membershipEventContent = parseMembershipEvent(event)
      if (!['join', 'leave', 'ban', 'kick'].includes(membershipEventContent.type))
        return

      updateMembers(true)
    },
  })

  return members
}
