<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  name: 'space-room',
})

const currentRoom = useCurrentRoom()
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
