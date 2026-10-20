<script setup lang="ts">
import type { SelectTriggerProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

import type { UButtonProps } from '../button.vue'

export type USelectTriggerProps = SelectTriggerProps & {
  class?: HTMLAttributes['class']
  size?: 'sm' | 'default'
  variant?: UButtonProps['variant']
  withIcon?: boolean
}

const props = withDefaults(defineProps<USelectTriggerProps>(), { size: 'default', variant: 'soft', withIcon: true })

const delegated = reactiveOmit(props, 'class', 'size')
const forwarded = useForwardProps(delegated)
</script>

<template>
  <SelectTrigger
    data-slot="select-trigger"
    :data-size="size"
    v-bind="forwarded"
    :class="
      cn(
        interactiveBase({ variant: props.variant, size: props.size }),
        'flex items-center justify-between data-placeholder:text-muted-foreground *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2',
        withIcon && 'pr-1.5',
        props.class,
      )
    "
  >
    <slot />

    <SelectIcon v-if="withIcon" as-child>
      <Icon :name="ICON__CHEVRON_DOWN" class="size-3.5!" />
    </SelectIcon>
  </SelectTrigger>
</template>
