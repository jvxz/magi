<script lang="ts" setup>
const props = defineProps<{ roomId: string | undefined; avatarUrl?: string }>()

const room = useRoom(() => props.roomId)
const isRoomJoined = useRoomComputed(
  () => props.roomId,
  r => (r ? isJoined(r) : undefined),
)
const isRoomSpace = useRoomComputed(
  () => props.roomId,
  r => (r ? isSpace(r) : undefined),
)
</script>

<template>
  <MenuItemInvite v-if="isRoomJoined" :payload="roomId ? { room: roomId } : undefined" />
  <MenuItemCopyUrl :id="roomId" type="roomId" />
  <MenuItemCopyId :id="roomId" />
  <MenuItemRoomSettings v-if="isRoomJoined" :room />

  <UMenuItemSeparator />

  <MenuItemViewAvatar v-if="props.avatarUrl" :payload="{ type: 'image', alt: roomId!, url: props.avatarUrl }" />
  <MenuItemViewAvatar v-else :payload="room ? { type: 'room', room } : undefined" />
  <MenuItemLeave v-if="isRoomJoined" :id="roomId" :type="isRoomSpace ? 'space' : 'room'" />
</template>
