<script setup lang="ts">
import type { DropdownMenuSubContentEmits, DropdownMenuSubContentProps } from 'reka-ui'

import { reactiveOmit } from '@vueuse/core'
import { useForwardPropsEmits } from 'reka-ui'

export type UContextMenuSubContentProps = DropdownMenuSubContentProps & { class?: HTMLAttributes['class'] }
export type UContextMenuSubContentEmits = DropdownMenuSubContentEmits

const props = defineProps<UContextMenuSubContentProps>()
const emits = defineEmits<UContextMenuSubContentEmits>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <ContextMenuSubContent v-bind="forwarded" :class="cn(popoverContentBase(), props.class)">
    <slot />
  </ContextMenuSubContent>
</template>
