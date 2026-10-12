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
const scrollEl = useTemplateRef<HTMLDivElement>('scrollEl')
const list = useTemplateRef('list')

watch(
  () => room.roomId,
  () => list.value?.virtualizer.scrollToIndex(0, { align: 'start' }),
  { flush: 'post' },
)
</script>

<template>
  <div class="border-l border-border shrink-0 h-full w-72">
    <div v-if="membersGrouped && isLoaded" ref="scrollEl" class="px-1 size-full overflow-auto">
      <VirtualList
        ref="list"
        v-slot="{ item }"
        :items="virtualizerList"
        :scroll-el="scrollEl"
        :estimate-size="item => (item.type === 'header' ? 32 : 41)"
        :get-item-key="item => (item.type === 'header' ? item.title : item.userId)"
      >
        <RoomMembersListHeader
          v-if="item.type === 'header'"
          :key="item.title"
          :title="item.title"
          :total="membersGrouped.groupTotals[item.title]"
        />

        <RoomMembersListCard v-else :key="item.userId" :is-owner="item.powerLevel >= 100" :user-id="item.userId" />
      </VirtualList>
    </div>

    <div v-else class="p-2 h-full relative">
      <USkeleton v-for="item in cachedCount" :key="item" class="mb-3 h-10 w-full" />
    </div>
  </div>
</template>
