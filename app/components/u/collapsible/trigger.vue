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
