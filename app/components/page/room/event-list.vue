<script lang="ts" setup>
import type { MatrixEvent, Room } from 'matrix-js-sdk'
import { EventType } from 'matrix-js-sdk'

const props = defineProps<{
  room: Room
}>()

const {
  events,
  getEventVersion,
  isFullyLoaded,
  scrollEventsAsync,
} = useRoomEvents(toRef(props, 'room'))

const containerRef = useTemplateRef<HTMLDivElement>('container')
const wrapperRef = useTemplateRef('wrapper')

const { isReady, itemBind, listPaginated: eventsPaginated, loadOlder } = useScrollPagination(events, containerRef, {
  canPaginate: ({ endItem, listPaginated }) => {
    if (!events.value.length)
      return false

    const backward = !isFullyLoaded.value || !listPaginated.includes(events.value[0]!)
    const forward = events.value.at(-1) !== endItem

    return {
      backward,
      forward,
    }
  },
  customItemsContainer: wrapperRef,
  identifier: 'getId',
  key: props.room.roomId,
  onBeforePaginate: async ({ dir, endItem, isOnLatestPage, listPaginated, startItem }) => {
    const chunk = await loadChunk(dir, startItem, endItem, isOnLatestPage)
    return dir === 'backward' ? [...chunk, ...listPaginated] : [...listPaginated, ...chunk]
  },
  windowSize: 7000,
})

async function loadChunk(
  dir: 'forward' | 'backward',
  startEvent: MatrixEvent,
  endEvent: MatrixEvent,
  isOnLatestPage: boolean,
) {
  const startId = startEvent.getId()
  const endId = endEvent.getId()

  if (!startId || !endId)
    return []

  if (dir === 'backward') {
    const prevStartEventIdx = events.value.findIndex(event => event.getId() === startId)
    if (prevStartEventIdx === -1)
      return []

    const remainingCachedEvents = events.value.slice(0, prevStartEventIdx)
    if (remainingCachedEvents.length) {
      const start = Math.max(0, prevStartEventIdx - BATCH_SIZE)
      return events.value.slice(start, prevStartEventIdx)
    }

    const prevEventsLength = events.value.length

    await scrollEventsAsync(dir)

    const amountAdded = events.value.length - prevEventsLength

    const startEventIdx = Math.max(0, prevStartEventIdx + amountAdded)

    const chunkSize = amountAdded > 0 ? amountAdded : BATCH_SIZE
    const start = Math.max(0, startEventIdx - chunkSize)

    return events.value.slice(start, startEventIdx)
  }

  const endEventIdx = events.value.findIndex(event => event.getId() === endId)
  if (endEventIdx === -1)
    return []

  const start = endEventIdx + (isOnLatestPage ? 1 : 0)
  const end = Math.min(events.value.length, start + BATCH_SIZE)

  return events.value.slice(start, end)
}

whenever(isReady, async () => {
  const container = unrefElement(containerRef)
  if (!container)
    return

  while (container.scrollHeight <= container.clientHeight && !isFullyLoaded.value) {
    const prevHeight = container.scrollHeight
    await loadOlder()
    if (prevHeight === container.scrollHeight)
      break
  }
}, { once: true })
</script>

<template>
  <div
    ref="container"
    class="scroll-container grid h-[calc(100%-3rem)] w-full content-end absolute overflow-x-hidden overflow-y-scroll"
  >
    <div ref="wrapper" class="w-full" data-testid="scroll-container-wrapper">
      <div
        v-for="(event, idx) in eventsPaginated"
        :key="`${event.getId() ?? idx}:${getEventVersion(event.getId() ?? '')}`"
        class="pb-4.25"
        v-bind="itemBind(event, idx)"
      >
        <PageRoomEventMessage
          v-if="event.getType() === EventType.RoomMessage || event.getType() === EventType.RoomMessageEncrypted"
          :event
        />
        <PageRoomEventMember
          v-else-if="event.getType() === EventType.RoomMember"
          :event
        />
      </div>
      <div class="h-8" />
    </div>
  </div>
</template>

<style scoped>
/* reset native scrollbar styling; breaks custom styling */
.scroll-container {
  scrollbar-color: auto;
}

.scroll-container::-webkit-scrollbar {
  width: 13px;
}

.scroll-container::-webkit-scrollbar-track {
  background-color: var(--card);

  /* align to bottom of container  */
  margin-bottom: 3rem;
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: var(--muted-foreground);
  border-radius: 9999px;

  /* padding */
  border: 3px solid transparent;
  background-clip: content-box;
}
</style>
