<script lang="ts" setup>
import type { MatrixEvent, Room } from 'matrix-js-sdk'

import { EventType } from 'matrix-js-sdk'

const props = defineProps<{
  event: MatrixEvent
  grouped: boolean
  room: Room
  dateDiffed: boolean
}>()

const type = computed(() => props.event.getType())
</script>

<template>
  <RoomEventDateSeparator v-if="dateDiffed" :event />

  <RoomEventMessage
    v-if="type === EventType.RoomMessage || type === EventType.RoomMessageEncrypted"
    :event
    :grouped
    :room
  />
  <RoomEventMember v-else-if="type === EventType.RoomMember" :event :grouped />
</template>
