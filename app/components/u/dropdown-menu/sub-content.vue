<script setup lang="ts">
import type { DropdownMenuSubContentEmits, DropdownMenuSubContentProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UDropdownMenuSubContentProps = DropdownMenuSubContentProps & { class?: HTMLAttributes['class'] }
export type UDropdownMenuSubContentEmits = DropdownMenuSubContentEmits

const props = defineProps<UDropdownMenuSubContentProps>()
const emits = defineEmits<UDropdownMenuSubContentEmits>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <DropdownMenuSubContent v-bind="forwarded" :class="cn(popoverContentBase(), props.class)">
    <slot />
  </DropdownMenuSubContent>
</template>
