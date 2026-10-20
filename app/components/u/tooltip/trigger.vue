<script setup lang="ts">
import type { TooltipTriggerProps } from 'reka-ui'

export type UTooltipTriggerProps = TooltipTriggerProps

const props = defineProps<UTooltipTriggerProps>()
</script>

<template>
  <TooltipTrigger v-bind="props">
    <slot />
  </TooltipTrigger>
</template>
