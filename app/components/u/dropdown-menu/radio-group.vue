<script setup lang="ts">
import type { DropdownMenuRadioGroupEmits, DropdownMenuRadioGroupProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UDropdownMenuRadioGroupProps = DropdownMenuRadioGroupProps
export type UDropdownMenuRadioGroupEmits = DropdownMenuRadioGroupEmits

const props = defineProps<UDropdownMenuRadioGroupProps>()
const emits = defineEmits<UDropdownMenuRadioGroupEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DropdownMenuRadioGroup v-bind="forwarded">
    <slot />
  </DropdownMenuRadioGroup>
</template>
