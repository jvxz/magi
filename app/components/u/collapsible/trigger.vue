<script lang="ts">
import type { VariantProps } from 'tailwind-variants'

import { buttonVariants } from '../button.vue'

export const collapsibleTriggerVariants = tv({
  base: 'w-full justify-start',
  defaultVariants: {
    variant: 'ghost',
  },
  extend: buttonVariants,
  variants: {
    variant: {
      ghost: 'data-[state=open]:(bg-selected hover:bg-selected) text-foreground',
    },
  },
})

export type CollapsibleTriggerVariants = VariantProps<typeof collapsibleTriggerVariants>
</script>

<script lang="ts" setup>
import type { CollapsibleTriggerProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

export type UCollapsibleTriggerProps = CollapsibleTriggerProps & {
  class?: HTMLAttributes['class']
  variant?: CollapsibleTriggerVariants['variant'] | 'room'
  size?: CollapsibleTriggerVariants['size']
}

const props = defineProps<UCollapsibleTriggerProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <CollapsibleTrigger
    v-bind="delegated"
    :class="
      cn(
        'group',
        collapsibleTriggerVariants({ variant: variant === 'room' ? undefined : variant, size }),
        variant === 'room' && 'py-2',
        props.class,
      )
    "
    data-slot="collapsible-trigger"
  >
    <slot />
  </CollapsibleTrigger>
</template>
