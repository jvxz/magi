<script lang="ts" setup>
import type { CollapsibleRootEmits, CollapsibleRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UCollapsibleRootProps = CollapsibleRootProps
export type UCollapsibleRootEmits = CollapsibleRootEmits

const props = defineProps<UCollapsibleRootProps>()
const emits = defineEmits<UCollapsibleRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <CollapsibleRoot v-slot="slotProps" v-bind="forwarded">
    <slot v-bind="slotProps" />
  </CollapsibleRoot>
</template>
