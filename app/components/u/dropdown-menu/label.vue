<script setup lang="ts">
import type { DropdownMenuLabelProps } from 'reka-ui'

import { reactiveOmit } from '@vueuse/core'
import { DropdownMenuLabel, useForwardProps } from 'reka-ui'

const props = defineProps<DropdownMenuLabelProps & { class?: HTMLAttributes['class']; inset?: boolean }>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegated)
</script>

<template>
  <DropdownMenuLabel v-bind="forwarded" :class="cn('px-2 py-1 text-sm font-medium data-[inset]:pl-8', props.class)">
    <slot />
  </DropdownMenuLabel>
</template>
