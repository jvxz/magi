<script lang="ts" setup>
import type { MatrixEvent } from 'matrix-js-sdk'
import { EventType } from 'matrix-js-sdk'

const props = defineProps<{
  event: MatrixEvent
}>()

assert(props.event.getType() === EventType.RoomMember, 'Event provided in PageRoomEventMember is not a RoomMember event')
const content = props.event.getContent()
</script>

<template>
  <PageRoomEvent
    :event-id="props.event.getId()"
    :event-type="props.event.getType()"
    data-event-type="member"
  >
    <p>{{ content.displayname }} {{ content.membership }}</p>
  </PageRoomEvent>
</template>
