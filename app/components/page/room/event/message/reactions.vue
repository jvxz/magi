<script lang="ts" setup>
import type { MatrixEvent, Room } from 'matrix-js-sdk'

const props = defineProps<{
  room: Room
  event: MatrixEvent
}>()

const { reactions } = useRoomEventReactions.provide(
  () => props.room,
  () => props.event,
)
</script>

<template>
  <div v-if="reactions" class="flex flex-row gap-1">
    <UTooltipProvider :delay-duration="700">
      <PageRoomEventMessageReactionsItem v-for="reaction in reactions.keys()" :key="reaction" :reaction />
    </UTooltipProvider>
  </div>
</template>
