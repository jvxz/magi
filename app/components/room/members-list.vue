<script lang="ts" setup>
import type { Room } from 'matrix-js-sdk'

const { room } = defineProps<{ room: Room }>()

const { isLoaded, members } = useRoomMembers(() => room)

const membersGrouped = useRoomMemberGrouping(members, () => room.roomId)

const cachedCount = useCachedCount(
  () => `${room.roomId}-members`,
  () => (members.value.length !== 0 ? Math.min(24, members.value.length) : undefined),
  8,
)

const virtualizerList = computed<MemberCachePayload['members']>(() => membersGrouped.value?.members ?? [])
const listRef = useTemplateRef('list')
const virtualizer = useListVirtualizer(virtualizerList, listRef, {
  estimateSize: memberOrHeader => {
    if (memberOrHeader.type === 'header') return 32
    else return 41
  },
  getItemKey: memberOrHeader => (memberOrHeader.type === 'header' ? memberOrHeader.title : memberOrHeader.userId),
})

watch(
  () => room.roomId,
  () => virtualizer.value.scrollToIndex(0, { align: 'start' }),
  { flush: 'post' },
)

const virtualItems = computed(() =>
  virtualizer.value.getVirtualItems().map(i => ({
    ...i,
    item: virtualizerList.value[i.index]!,
  })),
)
</script>

<template>
  <div class="border-l border-border shrink-0 h-full w-72">
    <div v-if="membersGrouped && isLoaded" ref="list" class="px-1 size-full overflow-auto">
      <div class="min-h-fit w-full relative" :style="{ height: `${virtualizer.getTotalSize()}px` }">
        <div
          v-for="{ item, ...virtualRow } in virtualItems"
          :key="String(virtualRow.key)"
          class="w-full left-0 top-0 absolute"
          :style="{ transform: `translateY(${virtualRow.start}px)` }"
        >
          <RoomMembersListHeader
            v-if="item.type === 'header'"
            :key="item.title"
            :title="item.title"
            :total="membersGrouped.groupTotals[item.title]"
          />

          <RoomMembersListCard v-else :key="item.userId" :is-owner="item.powerLevel >= 100" :user-id="item.userId" />
        </div>
      </div>
    </div>

    <div v-else class="p-2 h-full relative">
      <USkeleton v-for="item in cachedCount" :key="item" class="mb-3 h-10 w-full" />
    </div>
  </div>
</template>
