<script lang="ts" setup>
import type { Room } from 'matrix-js-sdk'

defineProps<{
  room: Room
}>()
</script>

<template>
  <LayoutAppAsideButton as-child class="p-0 size-11 overflow-hidden" :tooltip="room.name">
    <UContextMenuRegionTrigger as-child region="asideRoom" :value="{ room }">
      <NuxtLink
        active-class="anchor-name-active"
        :to="{
          name: 'space',
          params: {
            spaceId: room.roomId,
          },
        }"
      >
        <MatrixRoomAvatar square :room :alt="room.name" class="size-full" />
      </NuxtLink>
    </UContextMenuRegionTrigger>
  </LayoutAppAsideButton>
</template>
