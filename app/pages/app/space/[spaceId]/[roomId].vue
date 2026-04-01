<script lang="ts" setup>
import { EventType } from 'matrix-js-sdk'

definePageMeta({
  layout: 'app',
  name: 'space-room',
})

const currentRoom = useCurrentRoom()
const currentSpace = useCurrentSpace()

const events = useRoomEvents(() => currentRoom.value?.roomId)
</script>

<template>
  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader>
      {{ currentRoom?.name ?? currentSpace?.name }}
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <template v-for="event in events" :key="event.getId()">
    <PageRoomEventMessage v-if="event.getType() === EventType.RoomMessage" :event="event.getContent()" />
    <PageRoomEventMember v-else-if="event.getType() === EventType.RoomMember" :event="event.getContent()" />
  </template>
</template>
