<script lang="ts" setup>
import { injectRoomInstanceContext } from '../../instance.vue'
import { injectEventListItemContext } from '../generic.vue'

const { event } = injectEventListItemContext()
const { room } = injectRoomInstanceContext()

const { reactions } = useRoomEventReactions.provide(room, event)
</script>

<template>
  <div v-if="reactions" class="flex flex-row gap-1">
    <UTooltipProvider :delay-duration="700">
      <RoomEventMessageReactionsItem v-for="reaction in reactions.keys()" :key="reaction" :reaction />
    </UTooltipProvider>
  </div>
</template>
