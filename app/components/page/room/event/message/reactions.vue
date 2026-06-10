<script lang="ts" setup>
import { injectEventContext } from '../generic.vue'

const { room, event } = injectEventContext()

const { reactions } = useRoomEventReactions.provide(room, event)
</script>

<template>
  <div v-if="reactions" class="flex flex-row gap-1">
    <UTooltipProvider :delay-duration="700">
      <PageRoomEventMessageReactionsItem v-for="reaction in reactions.keys()" :key="reaction" :reaction />
    </UTooltipProvider>
  </div>
</template>
