<script lang="ts" setup>
import type { ContextMenuRootEmits, ContextMenuRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

const props = defineProps<ContextMenuRootProps>()
const emits = defineEmits<ContextMenuRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ContextMenuRoot v-bind="forwarded" data-slot="context-menu-root">
    <slot />
  </ContextMenuRoot>
</template>
