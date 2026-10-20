<script setup lang="ts">
import type { TooltipProviderProps } from 'reka-ui'

import { TooltipProvider } from 'reka-ui'

export type UTooltipProviderProps = TooltipProviderProps

const props = withDefaults(defineProps<UTooltipProviderProps>(), {
  delayDuration: 25,
})
</script>

<template>
  <TooltipProvider v-bind="props">
    <slot />
  </TooltipProvider>
</template>
