<script setup lang="ts">
import type { HoverCardTriggerProps } from 'reka-ui'

export type UHoverCardTriggerProps = HoverCardTriggerProps

const props = defineProps<UHoverCardTriggerProps>()
</script>

<template>
  <HoverCardTrigger v-bind="props">
    <slot />
  </HoverCardTrigger>
</template>
