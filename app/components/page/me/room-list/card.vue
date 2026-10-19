<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'

const { entry } = defineProps<{ entry: PinnedRoomEntry | RecentRoomEntry }>()

const roomId = toRef(() => entry.roomId)

const title = useRoomComputed(roomId, r => (r ? resolveRoomName(r) : 'Unknown room'))
const topic = useRoomComputed(roomId, r => getRoomTopic(r))
const memberCount = useRoomMemberCount(roomId)

const payload = computed<ContextMenuRegions['homeRoom']>(() => ({
  room: entry,
  type: 'lastVisited' in entry ? 'recent' : 'pinned',
}))

const to = computed<RouteLocationRaw | undefined>(() =>
  payload.value
    ? payload.value?.room.kind === 'direct'
      ? {
          name: 'direct-room',
          params: {
            directRoomId: payload.value?.room.roomId,
          },
        }
      : {
          name: 'space-room',
          params: {
            roomId: payload.value?.room.roomId,
            spaceId: payload.value?.room.spaceId,
          },
        }
    : undefined,
)
</script>

<template>
  <UContextMenuRegionTrigger as-child region="homeRoom" :value="payload">
    <URoomShowcaseCardRoot interactive group variant="raised" as-child>
      <NuxtLink :to>
        <URoomShowcaseCardImage as-child square :dialog="{ type: 'room', label: title, room: roomId }">
          <MatrixRoomAvatar :room="roomId" />
        </URoomShowcaseCardImage>

        <URoomShowcaseCardContent>
          <URoomShowcaseCardHeader>
            <URoomShowcaseCardTitle>
              {{ title }}
            </URoomShowcaseCardTitle>

            <URoomShowcaseCardDescription>
              <span v-if="isDefined(memberCount)">
                {{ memberCount }} {{ handlePlural(memberCount, 'members', 'member') }}
              </span>
              <USkeleton v-else class="h-1lh w-8" />

              <template v-if="topic">
                <UInlineSeparator />
                <span>{{ topic }}</span>
              </template>
            </URoomShowcaseCardDescription>
          </URoomShowcaseCardHeader>
        </URoomShowcaseCardContent>
      </NuxtLink>
    </URoomShowcaseCardRoot>
  </UContextMenuRegionTrigger>
</template>
