<script lang="ts" setup>
import type { EventType, StateEvents } from 'matrix-js-sdk'

const props = defineProps<{
  event: StateEvents[EventType.RoomMember]
}>()

const { displayname, membership } = props.event
</script>

<template>
  <p>{{ displayname }} {{ membership }}</p>
</template>
