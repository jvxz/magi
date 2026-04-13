<script lang="ts" setup>
import type { Room } from 'matrix-js-sdk'
import { EventType } from 'matrix-js-sdk'

const props = defineProps<{
  room: Room
}>()

const containerRef = useTemplateRef('container')
const wrapperRef = useTemplateRef('wrapper')

const {
  createItemBind,
  eventsPaginated,
  getEventVersion,
  handleOnMounted,
  scrollToBottom,
} = useEventPagination({
  itemsEl: wrapperRef,
  room: toRef(props, 'room'),
  scrollEl: containerRef,
})

onMounted(async () => {
  await nextTick()
  scrollToBottom()
  await handleOnMounted()
})
</script>

<template>
  <div
    ref="container"
    class="scroll-container grid h-[calc(100%-3rem)] w-full content-end absolute overflow-x-hidden overflow-y-scroll"
  >
    <div
      ref="wrapper"
      class="w-full"
      data-testid="scroll-container-wrapper"
    >
      <div
        v-for="(event, idx) in eventsPaginated"
        :key="`${event.getId() ?? idx}:${getEventVersion(event.getId() ?? '')}`"
        class="pb-4.25"
        :style="$config.public.testMode ? { height: `${(event as any)._size}px` } : undefined"
        v-bind="createItemBind(event, idx)"
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
      <div data-ignore class="h-8" />
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
