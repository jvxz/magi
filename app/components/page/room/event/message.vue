<script lang="ts" setup>
import type { EventType, TimelineEvents } from 'matrix-js-sdk'

const props = defineProps<{
  event: TimelineEvents[EventType.RoomMessage]
}>()

const { body } = props.event
</script>

<template>
  <p>{{ body }}</p>
</template>
