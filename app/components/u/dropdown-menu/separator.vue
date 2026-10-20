<script setup lang="ts">
import type { DropdownMenuSeparatorProps } from 'reka-ui'

export type UDropdownMenuSeparatorProps = DropdownMenuSeparatorProps & {
  class?: HTMLAttributes['class']
}

const props = defineProps<UDropdownMenuSeparatorProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <DropdownMenuSeparator v-bind="delegated" :class="cn('-mx-1 my-1 h-px bg-border-strong', props.class)" />
</template>
