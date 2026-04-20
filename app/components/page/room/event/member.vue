<script lang="ts" setup>
import type { MatrixEvent } from 'matrix-js-sdk'
import { EventType } from 'matrix-js-sdk'

const props = defineProps<{
  event: MatrixEvent
}>()

assert(props.event.getType() === EventType.RoomMember, 'Event provided in PageRoomEventMember is not a RoomMember event')
const body = computed(() => {
  const parsed = parseMembershipEvent(props.event)
  if (parsed.type === 'ban') {
    return {
      icon: 'tabler:hammer',
      message: ` was banned by `,
      sender: parsed.data.bannedName,
      subject: parsed.data.bannerName,
    }
  }

  if (parsed.type === 'unban') {
    return {
      icon: 'tabler:hammer-off',
      message: ` was unbanned by `,
      sender: parsed.data.unbannedName,
      subject: parsed.data.unbannerName,
    }
  }

  if (parsed.type === 'displayName') {
    if (parsed.data.type === 'changed') {
      return {
        icon: 'tabler:label',
        message: ` changed their display name`,
        sender: parsed.data.to,
      }
    }

    if (parsed.data.type === 'removed') {
      return {
        icon: 'tabler:label-off',
        message: ` removed their display name`,
        sender: parsed.data.name,
      }
    }
  }

  if (parsed.type === 'avatar') {
    if (parsed.data.type === 'changed') {
      return {
        icon: 'tabler:user',
        message: ` changed their avatar`,
        sender: parsed.data.name,
      }
    }

    if (parsed.data.type === 'removed') {
      return {
        icon: 'tabler:user-off',
        message: ` removed their avatar`,
        sender: parsed.data.name,
      }
    }
  }

  if (parsed.type === 'leave') {
    return {
      icon: 'tabler:minus',
      message: ` left the room`,
      sender: parsed.data.name,
    }
  }

  if (parsed.type === 'join') {
    return {
      icon: 'tabler:plus',
      message: ` joined the room`,
      sender: parsed.data.name,
    }
  }

  return {
    icon: 'tabler:question-circle',
    message: 'Unknown membership event',
    sender: null,
    subject: null,
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
    <p class="text-sm text-muted-foreground">
      <span v-if="body.sender" class="font-medium">{{ body.sender }}</span>
      {{ body.message }}
      <span v-if="body.subject" class="font-medium">{{ body.subject }}</span>
    </p>
  </PageRoomEvent>
</template>
