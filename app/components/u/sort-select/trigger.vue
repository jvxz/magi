<script lang="ts" setup>
import type { SelectTriggerProps } from 'reka-ui'

import type { UButtonProps } from '../button.vue'

export interface USortSelectTriggerProps extends SelectTriggerProps {
  class?: HTMLAttributes['class']
  size?: 'sm' | 'default'
  variant?: UButtonProps['variant']
}

const props = withDefaults(defineProps<USortSelectTriggerProps>(), {
  size: 'sm',
  variant: 'outline',
})
</script>

<template>
  <USelectTrigger
    data-slot="sort-select-trigger"
    v-bind="props"
    :class="
      cn(
        'relative -right-px peer rounded-r-0 border-r-transparent hover:border-r-border-strong data-[state=open]:border-r-border-strong z-1',
        props.class,
      )
    "
  >
    <slot>
      <USelectValue />
    </slot>
  </USelectTrigger>
</template>
