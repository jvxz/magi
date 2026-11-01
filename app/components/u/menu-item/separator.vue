<script lang="ts" setup>
import type { ContextMenuSeparatorProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { UContextMenuSeparator, UDropdownMenuSeparator } from '#components'

import { INJECTION_KEY__MENU_ITEM } from './index.vue'

// ContextMenuItemProps === DropdownMenuItemProps etc
export interface UMenuItemProps extends ContextMenuSeparatorProps {
  class?: HTMLAttributes['class']
  variant?: PopoverItemVariants['variant']
}

const props = defineProps<UMenuItemProps>()

const menuType = inject(INJECTION_KEY__MENU_ITEM)
const is = menuType === 'context' ? UContextMenuSeparator : menuType === 'dropdown' ? UDropdownMenuSeparator : 'div'
</script>

<template>
  <component :is v-bind="props">
    <slot />
  </component>
</template>
