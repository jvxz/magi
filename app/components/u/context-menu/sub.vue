<script setup lang="ts">
import type { ContextMenuSubEmits, ContextMenuSubProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UContextMenuSubProps = ContextMenuSubProps
export type UContextMenuSubEmits = ContextMenuSubEmits

const props = defineProps<UContextMenuSubProps>()
const emits = defineEmits<UContextMenuSubEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ContextMenuSub v-bind="forwarded">
    <slot />
  </ContextMenuSub>
</template>
