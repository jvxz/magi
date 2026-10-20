<script setup lang="ts">
import type { ToggleGroupItemProps } from 'reka-ui'
import type { VariantProps } from 'tailwind-variants'

import { ToggleGroupItem, useForwardProps } from 'reka-ui'

import { toggleVariants } from '../toggle.vue'
import { INJECTION_KEY__TOGGLE_GROUP } from './root.vue'

type ToggleGroupVariants = VariantProps<typeof toggleVariants> & {
  spacing?: number
}

export type UToggleGroupItemProps = ToggleGroupItemProps & {
  class?: HTMLAttributes['class']
  variant?: ToggleGroupVariants['variant']
  size?: ToggleGroupVariants['size']
}

const props = defineProps<UToggleGroupItemProps>()

const context = inject(INJECTION_KEY__TOGGLE_GROUP)

const delegated = reactiveOmit(props, 'class', 'size', 'variant')
const forwarded = useForwardProps(delegated)
</script>

<template>
  <ToggleGroupItem
    v-slot="slotProps"
    data-slot="toggle-group-item"
    :data-variant="context?.variant || variant"
    :data-size="context?.size || size"
    :data-spacing="context?.spacing"
    v-bind="forwarded"
    :class="
      cn(
        toggleVariants({
          variant: context?.variant || variant,
          size: context?.size || size,
        }),
        'w-auto min-w-0 shrink-0 ',
        props.class,
      )
    "
  >
    <slot v-bind="slotProps" />
  </ToggleGroupItem>
</template>
