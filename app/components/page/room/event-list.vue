<script lang="ts" setup>
import { EventType } from 'matrix-js-sdk'

const currentRoom = useCurrentRoom()
const events = useRoomEvents(currentRoom)

const containerRef = useTemplateRef<HTMLDivElement>('container')
const wrapperRef = useTemplateRef<HTMLDivElement>('wrapper')
let isPinned = true

useResizeObserver(wrapperRef, scrollToBottom)
watch(() => events.value.length, scrollToBottom, { flush: 'post' })

function onScroll(event: Event) {
  const target = event.target as HTMLElement
  isPinned = (target.scrollHeight - target.scrollTop - target.clientHeight) <= 10
}

function scrollToBottom() {
  if (!isPinned)
    return
  const containerEl = unrefElement(containerRef)
  if (!containerEl || !isPinned)
    return

  containerEl.scrollTop = containerEl.scrollHeight
}
</script>

<template>
  <div
    ref="container"
    class="scroll-container h-[calc(100%-3rem)] w-full absolute overflow-x-hidden overflow-y-scroll"
    @scroll="onScroll"
  >
    <div ref="wrapper" class="w-full space-y-4.25">
      <template v-for="event in events" :key="event.getId()">
        <PageRoomEventMessage
          v-if="event.getType() === EventType.RoomMessage"
          :content="event"
        />
        <PageRoomEventMember
          v-else-if="event.getType() === EventType.RoomMember"
          :content="event"
        />
      </template>
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
