<script setup lang="ts">
import type { DropdownMenuItemEmits, DropdownMenuItemProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UDropdownMenuItemProps = DropdownMenuItemProps & {
  class?: HTMLAttributes['class']
  variant?: PopoverItemVariants['variant']
}
export type UDropdownMenuItemEmits = DropdownMenuItemEmits

const props = defineProps<UDropdownMenuItemProps>()
const emits = defineEmits<UDropdownMenuItemEmits>()

const delegated = reactiveOmit(props, ['class', 'variant'])

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <DropdownMenuItem v-bind="forwarded" :class="cn(popoverItemBase({ variant }), props.class)">
    <slot />
  </DropdownMenuItem>
</template>
