<script lang="ts" setup>
import type { HierarchyRoom } from 'matrix-js-sdk'

defineProps<{ room: HierarchyRoom }>()
</script>

<template>
  <MenuItemSetRoom :room-id="room.room_id" :avatar-url="room.avatar_url" />
</template>
