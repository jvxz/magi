<script setup lang="ts">
import type { DropdownMenuRootEmits, DropdownMenuRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UDropdownMenuRootProps = DropdownMenuRootProps
export type UDropdownMenuRootEmits = DropdownMenuRootEmits

const props = defineProps<UDropdownMenuRootProps>()
const emits = defineEmits<UDropdownMenuRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DropdownMenuRoot v-bind="forwarded">
    <slot />
  </DropdownMenuRoot>
</template>
