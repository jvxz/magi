<script setup lang="ts">
import type { DropdownMenuContentEmits, DropdownMenuContentProps } from 'reka-ui'

import { injectDropdownMenuRootContext, useForwardPropsEmits } from 'reka-ui'

import { INJECTION_KEY__DROPDOWN_MENU_MODAL } from './root.vue'

export type UDropdownMenuContentProps = DropdownMenuContentProps & { class?: HTMLAttributes['class'] }
export type UDropdownMenuContentEmits = DropdownMenuContentEmits

const props = withDefaults(defineProps<UDropdownMenuContentProps>(), {
  sideOffset: 6,
})
const emits = defineEmits<UDropdownMenuContentEmits>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)

const { open, onOpenChange } = injectDropdownMenuRootContext()
const modal = inject(INJECTION_KEY__DROPDOWN_MENU_MODAL, null)
</script>

<template>
  <DropdownMenuPortal>
    <div v-if="modal && open" class="inset-0 fixed z-popover" @pointerdown.stop @click="onOpenChange(false)" />
    <DropdownMenuContent v-bind="forwarded" :class="cn(popoverContentBase(), props.class)">
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
