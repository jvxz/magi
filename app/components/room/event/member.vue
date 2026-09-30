<script lang="ts" setup>
import { EventType } from 'matrix-js-sdk'

import { injectEventListItemContext } from './generic.vue'

const { event } = injectEventListItemContext()

assert(
  event.value.getType() === EventType.RoomMember,
  'Event provided in PageRoomEventMember is not a RoomMember event',
)
const body = computed(() => {
  const parsed = parseMembershipEvent(event.value)
  if (parsed.type === 'ban') {
    return {
      icon: ICON__BAN,
      message: ` was banned by `,
      sender: parsed.data.bannedName,
      subject: parsed.data.bannerName,
    }
  }

  if (parsed.type === 'unban') {
    return {
      icon: ICON__UNBAN,
      message: ` was unbanned by `,
      sender: parsed.data.unbannedName,
      subject: parsed.data.unbannerName,
    }
  }

  if (parsed.type === 'kick') {
    return {
      icon: ICON__KICK,
      message: ` was kicked by `,
      sender: parsed.data.kickedName,
      subject: parsed.data.kickerName,
    }
  }

  if (parsed.type === 'displayName') {
    if (parsed.data.type === 'changed') {
      return {
        icon: ICON__DISPLAY_NAME,
        message: ` changed their display name`,
        sender: parsed.data.to,
      }
    }

    if (parsed.data.type === 'removed') {
      return {
        icon: ICON__DISPLAY_NAME_REMOVED,
        message: ` removed their display name`,
        sender: parsed.data.name,
      }
    }
  }

  if (parsed.type === 'avatar') {
    if (parsed.data.type === 'changed') {
      return {
        icon: ICON__AVATAR,
        message: ` changed their avatar`,
        sender: parsed.data.name,
      }
    }

    if (parsed.data.type === 'removed') {
      return {
        icon: ICON__AVATAR_REMOVED,
        message: ` removed their avatar`,
        sender: parsed.data.name,
      }
    }
  }

  if (parsed.type === 'leave') {
    return {
      icon: ICON__LEAVE,
      message: ` left the room`,
      sender: parsed.data.name,
    }
  }

  if (parsed.type === 'join') {
    return {
      icon: ICON__JOIN,
      message: ` joined the room`,
      sender: parsed.data.name,
    }
  }

  if (parsed.type === 'invite') {
    return {
      icon: ICON__INVITE,
      message: ` was invited to the room by `,
      sender: parsed.data.invitedName,
      subject: parsed.data.inviterName,
    }
  }

  if (parsed.type === 'knock') {
    return {
      icon: ICON__KNOCK,
      message: ` knocked on the room`,
      sender: parsed.data.name,
    }
  }

  return {
    icon: ICON__UNKNOWN,
    message: 'Unknown membership event',
    sender: null,
    subject: null,
    ...parsed,
  }
})
</script>

<template>
  <RoomEvent :event-type="event.getType()" data-event-type="member" class="flex gap-2 items-center">
    <Icon :name="body.icon" class="text-muted-foreground size-4" />
    <p class="text-sm text-muted-foreground">
      <span v-if="body.sender" class="font-medium">{{ body.sender }}</span>
      {{ body.message }}
      <span v-if="body.subject" class="font-medium">{{ body.subject }}</span>
    </p>
  </RoomEvent>
</template>
