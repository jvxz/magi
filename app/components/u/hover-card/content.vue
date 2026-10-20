<script setup lang="ts">
import type { HoverCardContentProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

const props = withDefaults(defineProps<HoverCardContentProps & { class?: HTMLAttributes['class'] }>(), {
  sideOffset: 8,
})

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegated)
</script>

<template>
  <HoverCardPortal>
    <HoverCardContent v-bind="forwarded" :class="cn(popoverContentBase(), 'w-64 p-4 text-sm', props.class)">
      <slot />
    </HoverCardContent>
  </HoverCardPortal>
</template>
