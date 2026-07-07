<script lang="ts" setup>
import type { PopoverContentEmits, PopoverContentProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

const props = defineProps<PopoverContentProps & { class?: string }>()
const emits = defineEmits<PopoverContentEmits>()

const { referenceElement, datetime } = useRoomEventTimestampTooltip()

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
      :class="
        cn(
          staticBase({ variant: 'default' }),
          'will-change-transform will-change-opacity z-tooltip p-0 bg-surface-raised px-3 py-1.5 text-sm text-balance font-medium',
          props.class,
        )
      "
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
        @vue:mounted="console.log('i mounted!')"
      />

      <PopoverArrow rounded class="translate-y-px scale-140 fill-surface-raised stroke-border" />
    </PopoverContent>
  </PopoverPortal>
</template>
