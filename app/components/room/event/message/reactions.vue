<script lang="ts" setup>
import { injectEventListItemContext } from '../generic.vue'

const { reactions } = injectEventListItemContext()
</script>

<template>
  <div v-if="reactions" class="flex flex-row gap-1">
    <UTooltipProvider :delay-duration="700">
      <RoomEventMessageReactionsItem
        v-for="[reaction, { shortcode }] in reactions.entries()"
        :key="reaction"
        :shortcode
        :reaction
      />
    </UTooltipProvider>
  </div>
</template>
