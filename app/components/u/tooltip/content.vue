<script setup lang="ts">
import type { TooltipContentEmits, TooltipContentProps } from 'reka-ui'

import { TooltipArrow, useForwardPropsEmits } from 'reka-ui'

export type UTooltipContentProps = TooltipContentProps & { class?: HTMLAttributes['class'] }
export type UTooltipContentEmits = TooltipContentEmits

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<UTooltipContentProps>(), {
  sideOffset: 6,
})

const emits = defineEmits<UTooltipContentEmits>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      v-bind="{ ...forwarded, ...$attrs }"
      id="tooltip-content"
      :collision-padding="4"
      :class="cn(tooltipContentBase(), props.class)"
    >
      <slot />
      <TooltipArrow rounded class="translate-y-px scale-140 fill-surface-top stroke-border-strong" />
    </TooltipContent>
  </TooltipPortal>
</template>

<style>
@keyframes tooltip-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes tooltip-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

#tooltip-content[data-state='instant-open'] {
  animation: tooltip-in 75ms ease;
}
#tooltip-content[data-state='delayed-open'] {
  animation: tooltip-in 75ms ease;
}

#tooltip-content[data-state='closed'] {
  animation: tooltip-out 75ms ease;
}
</style>
