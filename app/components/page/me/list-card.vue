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
</script>

<template>
  <NuxtLink class="group" :to>
    <URoomShowcaseCardRoot
      v-slot="{ room }"
      :room="payload.roomId"
      class="cursor-pointer group-data-[context-menu-open]:(border-border-strong bg-hover)"
    >
      <URoomShowcaseCardContent>
        <URoomShowcaseCardTitle class="flex items-center">
          <span>{{ room?.name }}</span>
        </URoomShowcaseCardTitle>

        <URoomShowcaseCardDescription>
          {{ room?.getJoinedMemberCount() }} members
          <template v-if="getRoomTopic(room)">
            <UInlineSeparator />
            <span> {{ getRoomTopic(room) }}</span>
          </template>
        </URoomShowcaseCardDescription>
      </URoomShowcaseCardContent>
    </URoomShowcaseCardRoot></NuxtLink
  >
</template>
