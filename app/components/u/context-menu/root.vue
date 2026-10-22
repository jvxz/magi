<script lang="ts" setup>
import type { ContextMenuRootEmits, ContextMenuRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

import { INJECTION_KEY__MENU_ITEM } from '../menu-item.vue'

export type UContextMenuRootProps = ContextMenuRootProps
export type UContextMenuRootEmits = ContextMenuRootEmits

const props = defineProps<UContextMenuRootProps>()
const emits = defineEmits<UContextMenuRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)

provide(INJECTION_KEY__MENU_ITEM, 'context')
</script>

<template>
  <ContextMenuRoot v-bind="forwarded" data-slot="context-menu-root">
    <slot />
  </ContextMenuRoot>
</template>
