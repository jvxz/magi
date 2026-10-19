<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'

const { entry } = defineProps<{ entry: PinnedRoomEntry | RecentRoomEntry }>()

const roomId = toRef(() => entry.roomId)

const title = useRoomComputed(roomId, r => (r ? resolveRoomName(r) : undefined))
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
        <URoomShowcaseCardImage
          as-child
          square
          :dialog="title ? { type: 'room', label: title, room: roomId } : undefined"
          prevent
        >
          <MatrixRoomAvatar :room="roomId" />
        </URoomShowcaseCardImage>

        <URoomShowcaseCardContent>
          <URoomShowcaseCardHeader>
            <URoomShowcaseCardTitle>
              <span v-if="title">{{ title }}</span>
              <USkeleton v-else class="h-1em w-12 rounded-sm" />
            </URoomShowcaseCardTitle>

            <URoomShowcaseCardDescription>
              <span v-if="isDefined(memberCount)">
                {{ memberCount }} {{ handlePlural(memberCount, 'members', 'member') }}
              </span>
              <USkeleton v-else class="h-1lh w-16 rounded-sm" />

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
