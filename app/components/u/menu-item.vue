<script lang="ts">
export type MenuItemInjectionKey = InjectionKey<'dropdown' | 'context'>

export const INJECTION_KEY__MENU_ITEM: MenuItemInjectionKey = Symbol('MenuItemInjectionKey')
</script>

<script lang="ts" setup>
import type { ContextMenuItemEmits, ContextMenuItemProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { useForwardPropsEmits } from 'reka-ui'

import { UContextMenuItem, UDropdownMenuItem } from '#components'

// ContextMenuItemProps === DropdownMenuItemProps etc
export interface UMenuItemProps extends ContextMenuItemProps {
  class?: HTMLAttributes['class']
  variant?: PopoverItemVariants['variant']
}
export type UMenuItemEmits = ContextMenuItemEmits

const props = defineProps<UMenuItemProps>()
const emits = defineEmits<UMenuItemEmits>()
const forwarded = useForwardPropsEmits(props, emits)

const menuType = inject(INJECTION_KEY__MENU_ITEM)
const is = menuType === 'context' ? UContextMenuItem : menuType === 'dropdown' ? UDropdownMenuItem : 'div'
</script>

<template>
  <component :is v-bind="forwarded">
    <slot />
  </component>
</template>
