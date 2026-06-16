<script lang="ts" setup>
import type { MatrixEvent, Room } from 'matrix-js-sdk'

defineProps<{ event: MatrixEvent; room: Room }>()
</script>

<template>
  <TooltipProvider>
    <PopoverRoot>
      <UContextMenuRegionRoot name="event">
        <UContextMenuRegionRoot name="member">
          <PageRoomEventMessage v-if="event && room" :room :event :grouped="false" />
        </UContextMenuRegionRoot>
      </UContextMenuRegionRoot>
    </PopoverRoot>
  </TooltipProvider>
</template>
