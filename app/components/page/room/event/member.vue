<script lang="ts" setup>
import type { MatrixEvent } from 'matrix-js-sdk'
import { EventType } from 'matrix-js-sdk'

const props = defineProps<{
  event: MatrixEvent
}>()

assert(props.event.getType() === EventType.RoomMember, 'Event provided in PageRoomEventMember is not a RoomMember event')
const body = computed(() => {
  const parsed = parseMembershipEvent(props.event)
  if (parsed.type === 'ban')
    return { icon: 'tabler:hammer', message: `**${parsed.data.bannedName}** was banned by **${parsed.data.bannerName}**` }

  if (parsed.type === 'unban')
    return { icon: 'tabler:hammer-off', message: `**${parsed.data.unbannedName}** was unbanned by **${parsed.data.unbannerName}**` }

  if (parsed.type === 'displayName') {
    if (parsed.data.type === 'changed')
      return { icon: 'tabler:label', message: `**${parsed.data.to}** changed their display name` }

    if (parsed.data.type === 'removed')
      return { icon: 'tabler:label-off', message: `**${parsed.data.name}** removed their display name` }
  }

  if (parsed.type === 'avatar') {
    if (parsed.data.type === 'changed')
      return { icon: 'tabler:user', message: `**${parsed.data.name}** changed their avatar` }

    if (parsed.data.type === 'removed')
      return { icon: 'tabler:user-off', message: `**${parsed.data.name}** removed their avatar` }
  }

  if (parsed.type === 'leave')
    return { icon: 'tabler:minus', message: `**${parsed.data.name}** left the room` }

  if (parsed.type === 'join')
    return { icon: 'tabler:plus', message: `**${parsed.data.name}** joined the room` }

  return {
    icon: 'tabler:question-circle',
    message: 'Unknown membership event',
    ...parsed,
  }
})
</script>

<template>
  <PageRoomEvent
    :event-id="props.event.getId()"
    :event-type="props.event.getType()"
    data-event-type="member"
    class="flex gap-2 items-center"
  >
    <Icon :name="body.icon" class="text-muted-foreground size-4" />
    <RenderMd class="text-sm text-muted-foreground" :content="body.message" />
  </PageRoomEvent>
</template>
