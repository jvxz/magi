<script setup lang="ts">
import type { DropdownMenuItemProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

export type UDropdownMenuItemProps = DropdownMenuItemProps & {
  class?: HTMLAttributes['class']
  variant?: PopoverItemVariants['variant']
}

const props = defineProps<UDropdownMenuItemProps>()

const delegated = reactiveOmit(props, ['class', 'variant'])

const forwarded = useForwardProps(delegated)
</script>

<template>
  <DropdownMenuItem v-bind="forwarded" :class="cn(popoverItemBase({ variant }), props.class)">
    <slot />
  </DropdownMenuItem>
</template>
