<script setup lang="ts">
import type { DropdownMenuSubEmits, DropdownMenuSubProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UDropdownMenuSubProps = DropdownMenuSubProps
export type UDropdownMenuSubEmits = DropdownMenuSubEmits

const props = defineProps<UDropdownMenuSubProps>()
const emits = defineEmits<UDropdownMenuSubEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DropdownMenuSub v-bind="forwarded">
    <slot />
  </DropdownMenuSub>
</template>
