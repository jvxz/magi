<script lang="ts" setup>
import type { MatrixEvent } from 'matrix-js-sdk'
import { EventType } from 'matrix-js-sdk'

const props = defineProps<{
  content: MatrixEvent
}>()

assert(props.content.getType() === EventType.RoomMember, 'Event provided in PageRoomEventMember is not a RoomMember event')
const content = props.content.getContent()
</script>

<template>
  <PageRoomEvent data-event-type="member">
    <p>{{ content.displayname }} {{ content.membership }}</p>
  </PageRoomEvent>
</template>
