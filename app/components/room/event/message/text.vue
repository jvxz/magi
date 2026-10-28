<script lang="ts" setup>
import { injectEventListItemContext } from '../generic.vue'

const { event, eventState } = injectEventListItemContext()
</script>

<template>
  <div v-if="eventState === 'decrypting'" class="text-base text-muted-foreground flex gap-1 italic items-center">
    <USpinner class="size-0.75lh" />
    <span class="text-muted-foreground">Decrypting event...</span>
  </div>

  <div v-else-if="eventState === 'decryptionFailure'" class="text-muted-foreground flex gap-1 italic items-center">
    <Icon :name="ICON__ENCRYPTED" />
    <span>Failed to decrypt event</span>
  </div>

  <RoomEventMessageBody v-else :event />
</template>
