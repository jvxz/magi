<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  name: 'space-room',
})

const config = useRuntimeConfig()

const currentRoom = config.public.testMode ? createMockRoom(500) : useCurrentRoom()
const currentSpace = useCurrentSpace()
</script>

<template>
  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader>
      {{ currentRoom?.name ?? currentSpace?.name }}
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <div class="flex flex-1 flex-col size-full relative">
    <PageRoomEventList v-if="currentRoom" :room="currentRoom" />
    <PageRoomInput />
  </div>
</template>
