<script lang="ts">
import type { MatrixEvent, Room } from 'matrix-js-sdk'
import type { ToRefs } from 'vue'

import { EventType } from 'matrix-js-sdk'
import { createContext } from 'reka-ui'

interface Props {
  room: Room
  grouped: boolean
  event: MatrixEvent
}

type RoomEventContext = ToRefs<Props>

export const [injectEventContext, provideEventContext] = createContext<RoomEventContext>('PageRoomEventGeneric')
</script>

<script lang="ts" setup>
const props = defineProps<Props>()

const type = computed(() => props.event.getType())

provideEventContext({
  event: shallowRef(props.event),
  grouped: toRef(props, 'grouped'),
  room: shallowRef(props.room),
})
</script>

<template>
  <PageRoomEventMessage v-if="type === EventType.RoomMessage || type === EventType.RoomMessageEncrypted" />
  <PageRoomEventMember v-else-if="type === EventType.RoomMember" />
</template>
