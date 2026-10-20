<script setup lang="ts">
import type { DropdownMenuCheckboxItemEmits, DropdownMenuCheckboxItemProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UDropdownMenuCheckboxItemProps = DropdownMenuCheckboxItemProps & { class?: HTMLAttributes['class'] }
export type UDropdownMenuCheckboxItemEmits = DropdownMenuCheckboxItemEmits

const props = defineProps<UDropdownMenuCheckboxItemProps>()
const emits = defineEmits<UDropdownMenuCheckboxItemEmits>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <DropdownMenuCheckboxItem v-bind="forwarded" :class="cn(popoverItemBase(), props.class)">
    <span class="flex size-3.5 pointer-events-none items-center left-2 justify-center absolute">
      <DropdownMenuItemIndicator>
        <Icon :name="ICON__CHECK" class="size-4" />
      </DropdownMenuItemIndicator>
    </span>
    <slot />
  </DropdownMenuCheckboxItem>
</template>
