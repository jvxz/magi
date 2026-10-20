<script setup lang="ts">
import type { DropdownMenuContentEmits, DropdownMenuContentProps } from 'reka-ui'

import { reactiveOmit } from '@vueuse/core'
import { useForwardPropsEmits } from 'reka-ui'

export type UDropdownMenuContentProps = DropdownMenuContentProps & { class?: HTMLAttributes['class'] }
export type UDropdownMenuContentEmits = DropdownMenuContentEmits

const props = withDefaults(defineProps<UDropdownMenuContentProps>(), {
  sideOffset: 6,
})
const emits = defineEmits<UDropdownMenuContentEmits>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent v-bind="forwarded" :class="cn(popoverContentBase(), props.class)">
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
