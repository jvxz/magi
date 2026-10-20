<script setup lang="ts">
import type { ContextMenuRadioGroupEmits, ContextMenuRadioGroupProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UContextMenuRadioGroupProps = ContextMenuRadioGroupProps
export type UContextMenuRadioGroupEmits = ContextMenuRadioGroupEmits

const props = defineProps<UContextMenuRadioGroupProps>()
const emits = defineEmits<UContextMenuRadioGroupEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ContextMenuRadioGroup v-bind="forwarded">
    <slot />
  </ContextMenuRadioGroup>
</template>
