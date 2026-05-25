<script lang="ts" setup>
import type { MatrixEvent, Room } from 'matrix-js-sdk'

defineProps<{ event: MatrixEvent; room: Room }>()
</script>

<template>
  <TooltipProvider>
    <PopoverRoot>
      <PageRoomEventMessage v-if="event && room" :room :event :grouped="false" />
    </PopoverRoot>
  </TooltipProvider>
</template>
