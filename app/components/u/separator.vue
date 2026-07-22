<script lang="ts" setup>
import type { SeparatorProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { useForwardPropsEmits } from 'reka-ui'

export interface USeparatorProps extends SeparatorProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<USeparatorProps>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated)
</script>

<template>
  <Separator
    v-bind="forwarded"
    :class="
      cn(
        'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        props.class,
      )
    "
    data-slot="separator"
  >
    <slot />
  </Separator>
</template>
