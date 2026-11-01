<script lang="ts" setup>
import type { HierarchyRoom } from 'matrix-js-sdk'

const { room } = defineProps<{ room: HierarchyRoom }>()

const id = computed(() => room.room_id)
const isJoined = useRoomIsJoined(() => room.room_id)
</script>

<template>
  <MenuItemInvite v-if="isJoined" :payload="{ room: id }" />
  <MenuItemCopyId :id />
  <MenuItemCopyUrl :id type="roomId" />

  <UMenuItemSeparator />

  <MenuItemViewAvatar :payload="{ type: 'room', room: id, alt: room.name ?? room.room_id }" />
  <MenuItemLeave v-if="isJoined" :id type="room" />
</template>
