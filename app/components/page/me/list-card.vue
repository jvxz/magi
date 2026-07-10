<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{ payload: ContextMenuRegions['homeRoom']['room'] }>()

const to = computed<RouteLocationRaw>(() =>
  props.payload.kind === 'group'
    ? {
        name: 'space-room',
        params: {
          roomId: props.payload.roomId,
          spaceId: props.payload.spaceId,
        },
      }
    : {
        name: 'direct-room',
        params: {
          directRoomId: props.payload.roomId,
        },
      },
)

const room = useRoom(() => props.payload.roomId)
const isJoined = useRoomIsJoined(() => props.payload.roomId)
</script>

<template>
  <NuxtLink class="group" :to>
    <URoomShowcaseCardRoot
      :room="payload.roomId"
      dynamic-styles
      class="cursor-pointer group-data-[context-menu-open]:(border-border-strong bg-hover)"
    >
      <URoomShowcaseCardContent>
        <URoomShowcaseCardHeader>
          <URoomShowcaseCardTitle
            class="flex items-center"
            :class="{
              'text-muted-foreground': !isJoined,
            }"
          >
            <span>{{ room?.name ?? payload.roomId }}</span>
          </URoomShowcaseCardTitle>

          <URoomShowcaseCardDescription>
            <template v-if="isJoined">
              <span
                >{{ room?.getJoinedMemberCount() }}
                {{ handlePlural(room?.getJoinedMemberCount() ?? 0, 'members', 'member') }}</span
              >
              <template v-if="getRoomTopic(room)">
                <UInlineSeparator />
                <span> {{ getRoomTopic(room) }}</span>
              </template>
            </template>

            <span v-else class="italic">Not joined</span>
          </URoomShowcaseCardDescription>
        </URoomShowcaseCardHeader>
      </URoomShowcaseCardContent>
    </URoomShowcaseCardRoot>
  </NuxtLink>
</template>
