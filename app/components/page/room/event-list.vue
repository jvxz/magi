<script lang="ts" setup>
import type { Room } from 'matrix-js-sdk'

const props = defineProps<{
  room: Room
}>()

const emits = defineEmits<{
  isPaginating: [value: boolean]
}>()
const containerRef = useTemplateRef('container')
const wrapperRef = useTemplateRef('wrapper')

const {
  createItemBind,
  events,
  eventsPaginated,
  getEventVersion,
  handleOnMounted,
  isFullyLoaded,
  isPaginating,
  scrollToBottom,
} = useEventPagination({
  itemsEl: wrapperRef,
  room: toRef(props, 'room'),
  scrollEl: containerRef,
})

onMounted(handleRoomUpdate)
watch(() => props.room.roomId, handleRoomUpdate)

async function handleRoomUpdate() {
  const expectedRoomId = props.room.roomId
  await nextTick()

  if (props.room.roomId !== expectedRoomId) return

  scrollToBottom()
  await handleOnMounted()
}

watch(isPaginating, v => emits('isPaginating', v))

const groupedEvents = useEventGrouping({ events, eventsPaginated })
</script>

<template>
  <UContextMenuRegionRoot name="event">
    <UContextMenuRegionRoot name="member">
      <div
        ref="container"
        class="scroll-container grid h-[calc(100%-3rem)] w-full content-end absolute overflow-x-hidden overflow-y-scroll"
        data-testid="scroll-container"
      >
        <div ref="wrapper" class="w-full" data-testid="scroll-container-wrapper">
          <div data-ignore class="h-4.25" />

          <PageRoomPaginateSkeleton v-if="!isFullyLoaded" />

          <div
            v-for="(event, idx) in groupedEvents.events"
            v-bind="createItemBind(event, idx)"
            :key="`${event.getId() ?? idx}:${getEventVersion(event.getId() ?? '')}`"
            :style="isTestMode() ? { height: `${(event as any)._size}px` } : undefined"
          >
            <PageRoomEventGeneric :event :grouped="groupedEvents.grouped[idx] !== false" :room />
          </div>
          <div data-ignore class="h-12" />
        </div>
      </div>

      <!-- member ctx menu -->
      <UContextMenuRegionContent name="member" v-slot="{ payload }">
        <PageRoomContextMenuMember v-if="payload" v-bind="payload" />
      </UContextMenuRegionContent>
    </UContextMenuRegionRoot>

    <!-- event ctx menu -->
    <UContextMenuRegionContent name="event" v-slot="{ payload }">
      <PageRoomContextMenuEvent v-if="payload" v-bind="payload" />
    </UContextMenuRegionContent>
  </UContextMenuRegionRoot>
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
  background-color: var(--surface);

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
