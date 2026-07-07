<script lang="ts" setup>
import type { PopoverContentEmits, PopoverContentProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

const props = defineProps<PopoverContentProps & { class?: string }>()
const emits = defineEmits<PopoverContentEmits>()

const { datetime, referenceElement } = useRoomEventTimestampTooltip()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <PopoverPortal>
    <PopoverContent
      v-bind="forwarded"
      data-slot="timestamp-tooltip-content"
      disable-outside-pointer-events
      :reference="referenceElement ?? undefined"
      :collision-padding="4"
      :side-offset="4"
      :class="
        cn(
          staticBase({ variant: 'default' }),
          'tooltip-content will-change-transform will-change-opacity z-tooltip p-0 bg-surface-raised px-3 py-1.5 text-sm text-balance font-medium',
          props.class,
        )
      "
      side="top"
    >
      <NuxtTime
        v-if="datetime"
        :datetime
        weekday="long"
        month="long"
        day="numeric"
        year="numeric"
        hour="numeric"
        minute="numeric"
      />

      <PopoverArrow rounded class="translate-y-px scale-140 fill-surface-raised stroke-border" />
    </PopoverContent>
  </PopoverPortal>
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

.tooltip-content[data-state='open'] {
  animation: tooltip-in 75ms ease;
}

.tooltip-content[data-state='closed'] {
  animation: tooltip-out 75ms ease;
}
</style>
