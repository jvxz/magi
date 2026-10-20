<script setup lang="ts">
import type { TooltipRootEmits, TooltipRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UTooltipRootProps = TooltipRootProps
export type UTooltipRootEmits = TooltipRootEmits

const props = defineProps<UTooltipRootProps>()
const emits = defineEmits<UTooltipRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <TooltipRoot v-bind="forwarded">
    <slot />
  </TooltipRoot>
</template>
