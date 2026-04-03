<script lang="ts" setup>
import { EventType } from 'matrix-js-sdk'

const currentRoom = useCurrentRoom()
const { events, scrollBackAsync } = useRoomEvents(currentRoom)

const containerRef = useTemplateRef<HTMLDivElement>('container')
const wrapperRef = useTemplateRef<HTMLDivElement>('wrapper')
const heightDiff = shallowRef(0)
let isPinned = true
let prevScrollTop = 0

useResizeObserver(wrapperRef, scrollToBottom)
watch(() => events.value.length, () => {
  if (isPinned)
    return scrollToBottom()
})

// handle initial load; if the container is taller than the wrapper, load more events
whenever(() => events.value.length && wrapperRef.value, () => {
  if (!wrapperRef.value || !containerRef.value)
    return

  if (containerRef.value.scrollHeight > wrapperRef.value.scrollHeight)
    loadMore()
}, { immediate: true, once: true })

watch(heightDiff, (diff) => {
  // if user is not at the very top of the container, don't manually scroll;
  // `overflow-anchor: none` on container handles it
  if (prevScrollTop !== 0)
    return

  const container = unrefElement(containerRef)
  if (!container)
    return

  container.scrollTo({ behavior: 'instant', top: prevScrollTop + diff })
})

async function onScroll(event: Event) {
  const target = event.target as HTMLElement
  isPinned = (target.scrollHeight - target.scrollTop - target.clientHeight) <= 10

  // if the user has scrolled to near the top of the container, load more events
  if (target.scrollTop <= 500)
    loadMore()

  prevScrollTop = target.scrollTop
}

let loading = false
async function loadMore() {
  // prevent extra loads to get accurate height diff
  if (loading)
    return

  const container = unrefElement(containerRef)
  if (!container)
    return

  loading = true

  const prevHeight = container.scrollHeight
  await scrollBackAsync()
  // container changes height after scrollBackAsync() adds new events
  const newHeight = container.scrollHeight

  heightDiff.value = newHeight - prevHeight

  loading = false
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
    class="scroll-container grid h-[calc(100%-3rem)] w-full content-end absolute overflow-x-hidden overflow-y-scroll"
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
