<script lang="ts" setup>
import type { MatrixEvent, Room } from 'matrix-js-sdk'
import { EventType } from 'matrix-js-sdk'

const props = defineProps<{
  event: MatrixEvent
  grouped: boolean
  room: Room
}>()

const type = computed(() => props.event.getType())
</script>

<template>
  <PageRoomEventMessage
    v-if="type === EventType.RoomMessage || EventType.RoomMessageEncrypted" 
    :event
    :grouped
    :room
  />
  <PageRoomEventMember
    v-else-if="type === EventType.RoomMember"
    :event
  />
</template>
