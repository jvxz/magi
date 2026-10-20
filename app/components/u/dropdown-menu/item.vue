<script setup lang="ts">
import type { DropdownMenuItemProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

const props = defineProps<DropdownMenuItemProps & { class?: HTMLAttributes['class']; inset?: boolean }>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegated)
</script>

<template>
  <DropdownMenuItem v-bind="forwarded" :class="cn(popoverItemBase(), props.class)">
    <slot />
  </DropdownMenuItem>
</template>
