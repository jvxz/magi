<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'

const { entry, type } = defineProps<{ entry: PinnedRoomEntry | RecentRoomEntry; type: 'pinned' | 'recent' }>()

const roomId = toRef(() => entry.roomId)

const title = useRoomComputed(roomId, r => (r ? resolveRoomName(r) : undefined))
const topic = useRoomComputed(roomId, r => getRoomTopic(r))
const memberCount = useRoomMemberCount(roomId)
const matrixStatus = useMatrixStatus()
const isSynced = computed(() => matrixStatus.value.isDataSynced)

const payload = computed<ContextMenuRegions['homeRoom']>(() => ({
  room: entry,
  type,
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
              <span v-else-if="isSynced" class="text-muted-foreground">Unknown room</span>
              <USkeleton v-else class="rounded-sm h-1em w-12" />
            </URoomShowcaseCardTitle>

            <URoomShowcaseCardDescription>
              <span v-if="isDefined(memberCount)">
                {{ memberCount }} {{ handlePlural(memberCount, 'members', 'member') }}
              </span>
              <span v-else-if="isSynced" class="italic">Not joined</span>
              <USkeleton v-else class="rounded-sm h-1lh w-16" />

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
