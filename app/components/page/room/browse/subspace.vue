<script lang="ts" setup>
import type { HierarchyRoom } from 'matrix-js-sdk'

const props = defineProps<{
  space: HierarchyRoom
  open: boolean
  count: number | undefined
  scrollEl: HTMLElement | null
}>()

const { conversationRooms, error, isLoading, suggestedRooms } = useSpaceHierarchy(
  () => props.space.room_id,
  () => props.open,
)
const rooms = computed(() => [...conversationRooms.value.values()])

const noRoomsAvailable = computed(() => !isLoading.value && !error.value && !conversationRooms.value.size)
</script>

<template>
  <VirtualList
    v-if="!isLoading && !error && conversationRooms.size"
    v-slot="{ item: room, index }"
    :items="rooms"
    :scroll-el="scrollEl"
    :estimate-size="(_, i) => (i ? 73 : 72)"
    :get-item-key="room => room.room_id"
  >
    <UCardGroupSeparator v-if="index" />
    <PageRoomBrowseCard :room :suggested="suggestedRooms.has(room.room_id)" />
  </VirtualList>

  <div
    v-else-if="noRoomsAvailable"
    :class="cn('w-full relative text-sm flex items-center gap-2 text-muted-foreground ', $attrs.class)"
  >
    <Icon name="tabler-ghost-3" class="size-1lh" />
    <span>No rooms available</span>
  </div>

  <template v-else-if="isLoading && !error">
    <USkeleton v-for="i in Math.max(1, count ?? 4)" :key="i" class="h-18 w-full" />
  </template>

  <UCardRoot
    v-else-if="error"
    v-bind="props"
    variant="danger"
    :class="cn('w-full relative p-3.5 border flex-row gap-3.5 ', $attrs.class)"
  >
    Unable to get rooms. Please try again later
  </UCardRoot>
</template>
