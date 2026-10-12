import type { Room, RoomMember } from 'matrix-js-sdk'

import { toRef } from '@vueuse/core'
import QuickLRU from 'quick-lru'

const POWER_LEVEL_ORDER = ['admin', 'moderator', 'member'] satisfies PowerLevelName[]

type Member = Pick<RoomMember, 'powerLevel' | 'rawDisplayName' | 'membership' | 'name' | 'userId'> & { type: 'member' }
interface MemberHeader {
  type: 'header'
  title: PowerLevelName
}

export interface MemberCachePayload {
  members: Prettify<Member | MemberHeader>[]
  groupTotals: Record<PowerLevelName, number>
  memberCount: number
}

export type GroupedMemberListItem = Prettify<Member | MemberHeader>

const roomMemberGroupCache = new QuickLRU<Room['roomId'], MemberCachePayload>({ maxSize: 12 })

export function useRoomMemberGrouping(
  members: MaybeRefOrGetter<RoomMember[] | undefined>,
  maybeRoomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>,
  force?: MaybeRefOrGetter<boolean>,
) {
  const membersRef = toRef(members)
  const roomIdRef = toRef(maybeRoomOrId)
  const forceRef = toRef(force)

  const membersGrouped = shallowRef<MemberCachePayload>()
  const roomId = computed(() => (roomIdRef.value ? resolveRoomId(roomIdRef.value) : undefined))

  watch(
    membersRef,
    members => {
      if (!members?.length || !roomId.value) return

      const cached = roomMemberGroupCache.get(roomId.value)
      if (cached && !forceRef.value && cached.memberCount === members.length) return (membersGrouped.value = cached)

      const payload = { ...createMembersList(members), memberCount: members.length }
      roomMemberGroupCache.set(roomId.value, payload)

      membersGrouped.value = payload
    },
    { immediate: true },
  )

  return membersGrouped
}

function createMembersList(members: RoomMember[]) {
  const membersSorted = sortMembersByPowerlevel(members)

  const membersGrouped = groupBy(membersSorted, m => getPowerLevelName(m.powerLevel, true))
  const membersWithHeaders: Prettify<Member | MemberHeader>[] = []
  const groupTotals: MemberCachePayload['groupTotals'] = {
    admin: 0,
    member: 0,
    moderator: 0,
    owner: 0,
    unknown: 0,
  }
  for (const groupName of POWER_LEVEL_ORDER) {
    const group = membersGrouped[groupName]
    if (!group?.length) continue

    groupTotals[groupName] = group.length

    membersWithHeaders.push({ title: groupName, type: 'header' })
    for (let i = 0; i < group.length; i++) {
      const member = group[i]
      if (!member) continue

      membersWithHeaders.push({ type: 'member', ...member })
    }
  }

  return {
    groupTotals,
    members: membersWithHeaders,
  }
}
